"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  type: "yes-no" | "text" | "score" | "file";
}

interface Section {
  id: string;
  name: string;
  questions: Question[];
  expanded: boolean;
}

export default function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [isActive, setIsActive] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_templates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setTemplateName(data.name || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setVersion(data.version || "1.0.0");
        setIsActive(data.is_active ?? true);
        setSections(data.sections || []);
      }
    } catch (error: any) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load template");
      router.push("/dashboard/templates");
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Math.random().toString(),
        name: `Section ${sections.length + 1}`,
        questions: [],
        expanded: true,
      },
    ]);
  };

  const addQuestion = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  id: Math.random().toString(),
                  text: "",
                  type: "yes-no" as const,
                },
              ],
            }
          : section
      )
    );
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((q) => q.id !== questionId),
            }
          : section
      )
    );
  };

  const updateSectionName = (sectionId: string, name: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, name } : section
      )
    );
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : section
      )
    );
  };

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const handleSubmit = async () => {
    if (!templateName || !category) {
      toast.error("Template name and category are required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("audit_templates")
        .update({
          name: templateName,
          description,
          category,
          version,
          is_active: isActive,
          sections,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Template updated successfully!");
      router.push("/dashboard/templates");
    } catch (error: any) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Loading template...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Edit Audit Template
          </h1>
          <p className="text-foreground/70 mt-1">
            Modify the existing audit template
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/templates")}
          className="border-border bg-transparent"
        >
          Cancel
        </Button>
      </div>

      {/* Template Info */}
      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Template Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Template Name
            </label>
            <Input
              type="text"
              placeholder="e.g., ISO 9001 Quality Management"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the purpose of this audit template..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select category</option>
              <option value="Quality">Quality</option>
              <option value="Safety">Safety</option>
              <option value="Finance">Finance</option>
              <option value="Security">Security</option>
              <option value="Environment">Environment</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Version
              </label>
              <Input
                type="text"
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={isActive ? "active" : "inactive"}
                onChange={(e) => setIsActive(e.target.value === "active")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Sections and Questions */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="border-border overflow-hidden">
            <div className="p-6 bg-secondary/30 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition">
              <div className="flex items-center gap-3 flex-1">
                <div
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {section.expanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
                <Input
                  value={section.name}
                  onChange={(e) =>
                    updateSectionName(section.id, e.target.value)
                  }
                  className="font-semibold text-foreground bg-transparent border-none p-0 focus-visible:ring-0 w-auto min-w-[200px]"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-auto">
                  {section.questions.length} Questions
                </span>
              </div>
            </div>

            {section.expanded && (
              <div className="p-6 space-y-4">
                {section.questions.map((question) => (
                  <div
                    key={question.id}
                    className="flex gap-4 items-start pb-4 border-b border-border last:border-0"
                  >
                    <Input
                      type="text"
                      placeholder="Enter question text..."
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(section.id, question.id, {
                          text: e.target.value,
                        })
                      }
                      className="flex-1 bg-secondary/50 border-border"
                    />
                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(section.id, question.id, {
                          type: e.target.value as Question["type"],
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="yes-no">Yes / No</option>
                      <option value="text">Text</option>
                      <option value="score">Score</option>
                      <option value="file">File Upload</option>
                    </select>
                    <button
                      onClick={() => deleteQuestion(section.id, question.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 justify-center"
                  onClick={() => addQuestion(section.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Section Button */}
      <Button
        variant="outline"
        className="w-full border-border bg-transparent"
        onClick={addSection}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Section
      </Button>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving Changes..." : "Update Template"}
        </Button>
      </div>
    </div>
  );
}
