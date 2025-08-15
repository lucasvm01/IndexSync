import React, { useState, useRef } from 'react';
import { MathReference, SortField, SortDirection } from '@/types/math-reference';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MathReferenceTableProps {
  references: MathReference[];
  onSort: (field: SortField, direction: SortDirection) => void;
  onAddNew: () => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export const MathReferenceTable: React.FC<MathReferenceTableProps> = ({
  references,
  onSort,
  onAddNew,
  sortField,
  sortDirection
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const tableRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent, id: string) => {
    setHoveredId(id);
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      x: rect.right + 10,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  const renderSortButton = (field: SortField, label: string) => {
    const isActive = sortField === field;
    const direction = isActive ? sortDirection : 'asc';
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSort(field, isActive && direction === 'asc' ? 'desc' : 'asc')}
        className="h-auto p-2 font-medium justify-start text-left hover:bg-academic-blue-light"
      >
        {label}
        {isActive && (
          sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
        )}
      </Button>
    );
  };

  const getTypeColor = (type: MathReference['type']) => {
    const colors = {
      theorem: 'bg-primary text-primary-foreground',
      definition: 'bg-accent text-accent-foreground',
      proposition: 'bg-secondary text-secondary-foreground',
      example: 'bg-muted text-muted-foreground',
      other: 'bg-academic-gray text-white'
    };
    return colors[type];
  };

  const hoveredReference = references.find(ref => ref.id === hoveredId);

  return (
    <div className="relative" ref={tableRef}>
      <Card className="shadow-card">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Math Reference Index</h2>
              <p className="text-muted-foreground mt-1">Correlate textbook and teacher indexing systems</p>
            </div>
            <Button onClick={onAddNew} className="bg-gradient-academic hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-table-header border-b border-border">
              <div className="grid grid-cols-6 gap-4 p-4">
                <div className="col-span-1">
                  {renderSortButton('bookIndex', 'Book Index')}
                </div>
                <div className="col-span-1">
                  {renderSortButton('teacherIndex', 'Teacher Index')}
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-sm">Title & Type</span>
                </div>
                <div className="col-span-1">
                  <span className="font-medium text-sm">Screenshot</span>
                </div>
                <div className="col-span-1">
                  {renderSortButton('dateAdded', 'Date Added')}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-border">
              {references.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No references added yet. Click "Add Reference" to get started.</p>
                </div>
              ) : (
                references.map((reference) => (
                  <div
                    key={reference.id}
                    className={cn(
                      "grid grid-cols-6 gap-4 p-4 hover:bg-academic-blue-light/30 transition-colors cursor-pointer",
                      hoveredId === reference.id && "bg-math-preview"
                    )}
                    onMouseEnter={(e) => reference.imageUrl && handleMouseEnter(e, reference.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="col-span-1">
                      <span className="font-mono text-sm font-medium text-primary">
                        {reference.bookIndex}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="font-mono text-sm font-medium text-accent">
                        {reference.teacherIndex}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-foreground">{reference.title}</p>
                        <Badge variant="secondary" className={getTypeColor(reference.type)}>
                          {reference.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-1">
                      {reference.imageUrl && (
                        <div className="w-8 h-8 bg-muted rounded border border-border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">📷</span>
                        </div>
                      )}
                    </div>
                    <div className="col-span-1">
                      <span className="text-xs text-muted-foreground">
                        {reference.dateAdded.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Image Preview */}
      {hoveredReference && hoveredReference.imageUrl && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: previewPosition.x,
            top: previewPosition.y,
            transform: 'translateY(-50%)'
          }}
        >
          <Card className="p-2 shadow-preview bg-academic-surface border-primary/20">
            <img
              src={hoveredReference.imageUrl}
              alt={`Screenshot for ${hoveredReference.title}`}
              className="max-w-xs max-h-80 object-contain rounded"
            />
            <p className="text-xs text-muted-foreground mt-2 px-1">
              {hoveredReference.title}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};