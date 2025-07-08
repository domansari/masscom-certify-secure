
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Certificate {
  id: string;
  certificate_id: string;
  student_name: string;
  father_name: string;
  course_name: string;
  duration: string;
  completion_date: string;
  grade: string;
  student_coordinator: string;
  roll_no?: string;
  batch_number?: string;
}

interface EditCertificateFormProps {
  certificate: Certificate;
  onUpdate: (data: any) => void;
  onCancel: () => void;
}

const EditCertificateForm = ({ certificate, onUpdate, onCancel }: EditCertificateFormProps) => {
  const [formData, setFormData] = useState({
    student_name: certificate.student_name,
    father_name: certificate.father_name || "",
    course_name: certificate.course_name,
    duration: certificate.duration || "",
    completion_date: new Date(certificate.completion_date),
    grade: certificate.grade || "",
    student_coordinator: certificate.student_coordinator || "",
    roll_no: certificate.roll_no || "",
    batch_number: certificate.batch_number || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      completion_date: format(formData.completion_date, "yyyy-MM-dd"),
      updated_at: new Date().toISOString(),
    };

    onUpdate(updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student_name">Student Name *</Label>
          <Input
            id="student_name"
            value={formData.student_name}
            onChange={(e) => handleInputChange("student_name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="father_name">Father's Name</Label>
          <Input
            id="father_name"
            value={formData.father_name}
            onChange={(e) => handleInputChange("father_name", e.target.value)}
            placeholder="Father's name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_name">Course Name *</Label>
          <Input
            id="course_name"
            value={formData.course_name}
            onChange={(e) => handleInputChange("course_name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            placeholder="e.g., 6 months"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion_date">Completion Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.completion_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.completion_date ? format(formData.completion_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.completion_date}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, completion_date: date }))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => handleInputChange("grade", e.target.value)}
            placeholder="e.g., A+, Pass, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roll_no">Roll Number</Label>
          <Input
            id="roll_no"
            value={formData.roll_no}
            onChange={(e) => handleInputChange("roll_no", e.target.value)}
            placeholder="Student roll number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_number">Batch Number</Label>
          <Input
            id="batch_number"
            value={formData.batch_number}
            onChange={(e) => handleInputChange("batch_number", e.target.value)}
            placeholder="e.g., 2024-01"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="student_coordinator">Student Coordinator</Label>
        <Input
          id="student_coordinator"
          value={formData.student_coordinator}
          onChange={(e) => handleInputChange("student_coordinator", e.target.value)}
          placeholder="Coordinator name"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Certificate
        </Button>
      </div>
    </form>
  );
};

export default EditCertificateForm;
