import React, { useState, useMemo } from 'react';
import { MathReference, SortField, SortDirection } from '@/types/math-reference';
import { MathReferenceTable } from '@/components/MathReferenceTable';
import { AddReferenceDialog } from '@/components/AddReferenceDialog';

const Index = () => {
  const [references, setReferences] = useState<MathReference[]>([
    {
      id: '1',
      bookIndex: '3.2.1',
      teacherIndex: 'T-12',
      title: 'Pythagorean Theorem',
      type: 'theorem',
      description: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.',
      dateAdded: new Date('2024-01-15'),
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      bookIndex: '1.5.3',
      teacherIndex: 'L-3',
      title: 'Definition of Limit',
      type: 'definition',
      description: 'Formal epsilon-delta definition of limits.',
      dateAdded: new Date('2024-01-10'),
      imageUrl: '/placeholder.svg'
    },
    {
      id: '3',
      bookIndex: '7.1.2',
      teacherIndex: 'P-8',
      title: 'Fundamental Theorem of Calculus',
      type: 'theorem',
      description: 'Connects differentiation and integration.',
      dateAdded: new Date('2024-01-20'),
      imageUrl: '/placeholder.svg'
    }
  ]);

  const [sortField, setSortField] = useState<SortField>('bookIndex');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sortedReferences = useMemo(() => {
    return [...references].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'bookIndex':
          aValue = a.bookIndex;
          bValue = b.bookIndex;
          break;
        case 'teacherIndex':
          aValue = a.teacherIndex;
          bValue = b.teacherIndex;
          break;
        case 'dateAdded':
          aValue = a.dateAdded.getTime();
          bValue = b.dateAdded.getTime();
          break;
        default:
          return 0;
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [references, sortField, sortDirection]);

  const handleSort = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleAddReference = (newReference: Omit<MathReference, 'id' | 'dateAdded'>) => {
    const reference: MathReference = {
      ...newReference,
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setReferences(prev => [...prev, reference]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <MathReferenceTable
          references={sortedReferences}
          onSort={handleSort}
          onAddNew={() => setIsAddDialogOpen(true)}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        
        <AddReferenceDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddReference}
        />
      </div>
    </div>
  );
};

export default Index;
