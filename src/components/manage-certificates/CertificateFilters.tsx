
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'completion_date' | 'course_name' | 'student_name' | 'created_at' | 'batch_number';
type SortOrder = 'asc' | 'desc';

interface CertificateFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  totalRecords: number;
  startIndex: number;
  endIndex: number;
}

export const CertificateFilters: React.FC<CertificateFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  totalRecords,
  startIndex,
  endIndex
}) => {
  return (
    <div className="mb-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by student name, certificate ID, course, roll number, or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
        />
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <Label htmlFor="sort-field" className="text-sm font-medium text-white">
            Sort by:
          </Label>
          <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
            <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Added</SelectItem>
              <SelectItem value="completion_date">Completion Date</SelectItem>
              <SelectItem value="course_name">Course Name</SelectItem>
              <SelectItem value="student_name">Student Name</SelectItem>
              <SelectItem value="batch_number">Batch Number</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        <div className="text-sm text-gray-200">
          Showing {startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords} certificates
        </div>
      </div>
    </div>
  );
};
