
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
                className="h-auto p-0 font-medium text-left justify-start hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white text-white transition-all duration-200 hover:shadow-lg"
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
                className="h-auto p-0 font-medium text-left justify-start hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white text-white transition-all duration-200 hover:shadow-lg"
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
                className="h-auto p-0 font-medium text-left justify-start hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white text-white transition-all duration-200 hover:shadow-lg"
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
                className="h-auto p-0 font-medium text-left justify-start hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white text-white transition-all duration-200 hover:shadow-lg"
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
                    onClick={() => onEdit(certificate)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Link to={`/print/${certificate.id}`}>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => onDelete(certificate)}
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg transition-all duration-300 hover:scale-105"
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
