"use client";

import Editor from "@monaco-editor/react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

export default function CodeEditor({
    value,
    language,
    onChange,
    height = "500px",
    readOnly = false,
    className, 
}: CodeEditorProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn(
          "overflow-hidden p-0",
          className
        )}>
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={(value) => onChange(value ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontLigatures: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
            padding: { top: 16, },
            readOnly,
          }}
        />
      </GlassCard>
    </motion.div>
  );
}