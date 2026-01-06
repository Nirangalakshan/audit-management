import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OpenRouter API Key not found. Please set OPENROUTER_API_KEY in your .env.local file.",
      },
      { status: 500 }
    );
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 0. Check for existing report
    const { data: existingReport } = await supabase
      .from("ai_audit_reports")
      .select("report_content")
      .eq("session_id", sessionId)
      .single();

    if (existingReport) {
      return NextResponse.json({ report: existingReport.report_content });
    }

    // 1. Fetch Audit Session
    const { data: session, error: sessionError } = await supabase
      .from("audit_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      return NextResponse.json(
        { error: "Audit session not found" },
        { status: 404 }
      );
    }

    // 2. Fetch Audit Template (to get questions/sections structure)
    const { data: template, error: templateError } = await supabase
      .from("audit_templates")
      .select("*")
      .eq("id", session.template_id)
      .single();

    if (templateError || !template) {
      console.error("Template error:", templateError);
      return NextResponse.json(
        { error: "Audit template not found" },
        { status: 404 }
      );
    }

    // 3. Fetch Responses
    const { data: responses, error: responsesError } = await supabase
      .from("audit_responses")
      .select("*")
      .eq("session_id", sessionId);

    if (responsesError) {
      console.error("Responses error:", responsesError);
      return NextResponse.json(
        { error: "Failed to fetch responses" },
        { status: 500 }
      );
    }

    // 4. Construct the Context for AI
    const questionsMap = new Map();
    template.sections?.forEach((section: any) => {
      section.questions?.forEach((q: any) => {
        questionsMap.set(q.id, { text: q.text, section: section.name });
      });
    });

    let auditContext = `Audit Report Context:\n`;
    auditContext += `Audit Name: ${session.template_name}\n`;
    auditContext += `Department: ${session.department}\n`;
    auditContext += `Auditor: ${session.auditor_name}\n`;
    auditContext += `Date: ${new Date(
      session.created_at
    ).toLocaleDateString()}\n\n`;

    auditContext += `Findings:\n`;

    // Group responses by status for better context
    const nonCompliances: string[] = [];
    const compliance: string[] = [];
    const warnings: string[] = [];

    responses?.forEach((r: any) => {
      const q = questionsMap.get(r.question_id);
      if (!q) return;

      const entry = `- [${q.section}] ${q.text}: ${r.status}${
        r.notes ? ` (Notes: ${r.notes})` : ""
      }`;

      if (r.status === "non-compliance") {
        nonCompliances.push(entry);
      } else if (r.status === "warning") {
        warnings.push(entry);
      } else {
        compliance.push(entry);
      }
    });

    if (nonCompliances.length > 0) {
      auditContext +=
        "\nNon-Compliances (CRITICAL):\n" + nonCompliances.join("\n");
    }
    if (warnings.length > 0) {
      auditContext +=
        "\nWarnings (Requires Attention):\n" + warnings.join("\n");
    }
    if (compliance.length > 0) {
      auditContext += "\nCompliant Areas:\n" + compliance.join("\n");
    }

    // 5. Call OpenRouter API
    const prompt = `
      You are an expert Audit Reporting AI. Based on the following audit findings, generate a professional, detailed audit report.
      Use Markdown formatting.
      
      Structure the report as follows:
      1. **Executive Summary**: A brief overview of the audit performance.
      2. **Key Findings**: Highlight the main non-compliances and warnings.
      3. **Detailed Analysis**: Discuss the implications of the findings.
      4. **Recommendations**: Actionable steps to address the non-compliances and warnings.
      5. **Conclusion**: Final verdict and next steps.

      ${auditContext}
    `;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
          "X-Title": "Audit Management System", // Optional
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free", // Or any other model user prefers, effectively cheap & good
          messages: [
            {
              role: "system",
              content: "You are a professional auditor assistant.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API Error:", errText);
      return NextResponse.json(
        { error: "Failed to generate report" },
        { status: response.status }
      );
    }

    const aiData = await response.json();
    const generatedReport =
      aiData.choices?.[0]?.message?.content || "No report generated.";

    // 6. Save Report
    await supabase.from("ai_audit_reports").insert({
      session_id: sessionId,
      report_content: generatedReport,
    });

    return NextResponse.json({ report: generatedReport });
  } catch (error) {
    console.error("Handler error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
