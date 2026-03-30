import { cn } from "@/lib/utils";
import { CloudUpload } from "lucide-react";
import { motion } from "motion/react";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";

interface UploadBoxProps {
  label?: string;
  subLabel?: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

export function UploadBox({
  label = "Drop files here or click to upload",
  subLabel = "Supports: PDF, PNG, JPG, XLSX",
  accept,
  multiple = false,
  onFilesChange,
  className,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const arr = Array.from(files);
      setFileNames(arr.map((f) => f.name));
      onFilesChange?.(arr);
    },
    [onFilesChange],
  );

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleFiles(e.target.files);

  return (
    <motion.div
      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors duration-150",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/20 hover:border-primary hover:bg-primary/5",
        className,
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-ocid="upload.dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        data-ocid="upload.upload_button"
      />

      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
          isDragging
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <CloudUpload size={24} />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
      </div>

      {fileNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {fileNames.map((name) => (
            <span
              key={name}
              className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
