
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, ArrowUpDown, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  created_at: string;
}

type SortField = 'completion_date' | 'course_name' | 'student_name' | 'created_at' | 'batch_number';
type SortOrder = 'asc' | 'desc';

interface CertificateTableProps {
  certificates: Certificate[];
  onEdit: (certificate: Certificate) => void;
  onDelete: (certificate: Certificate) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  onSort
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20">
            <TableHead className="text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('student_name')}
                className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
              >
                Student Name
                {getSortIcon('student_name')}
              </Button>
            </TableHead>
            <TableHead className="text-white">Roll No</TableHead>
            <TableHead className="text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('course_name')}
                className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
              >
                Course
                {getSortIcon('course_name')}
              </Button>
            </TableHead>
            <TableHead className="text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('batch_number')}
                className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
              >
                Batch
                {getSortIcon('batch_number')}
              </Button>
            </TableHead>
            <TableHead className="text-white">Certificate ID</TableHead>
            <TableHead className="text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort('completion_date')}
                className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent text-white"
              >
                Completion Date
                {getSortIcon('completion_date')}
              </Button>
            </TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate) => (
            <TableRow key={certificate.id} className="border-white/20">
              <TableCell className="font-medium text-white">
                {certificate.student_name}
              </TableCell>
              <TableCell className="text-gray-200">{certificate.roll_no || "N/A"}</TableCell>
              <TableCell className="text-gray-200">{certificate.course_name}</TableCell>
              <TableCell className="text-gray-200">{certificate.batch_number || "N/A"}</TableCell>
              <TableCell className="font-mono text-xs text-gray-200">
                {certificate.certificate_id}
              </TableCell>
              <TableCell className="text-gray-200">
                {new Date(certificate.completion_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(certificate)}
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Link to={`/print/${certificate.id}`}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(certificate)}
                    className="text-red-400 hover:text-red-300 border-red-400/50 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
