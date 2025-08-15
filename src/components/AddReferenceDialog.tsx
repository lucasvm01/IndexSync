import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MathReference } from '@/types/math-reference';
import { Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AddReferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (reference: Omit<MathReference, 'id' | 'dateAdded'>) => void;
}

export const AddReferenceDialog: React.FC<AddReferenceDialogProps> = ({
  open,
  onOpenChange,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    bookIndex: '',
    teacherIndex: '',
    title: '',
    type: 'theorem' as MathReference['type'],
    description: '',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookIndex || !formData.teacherIndex || !formData.title) {
      return;
    }

    onAdd({
      bookIndex: formData.bookIndex,
      teacherIndex: formData.teacherIndex,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      imageUrl: formData.imageUrl
    });

    // Reset form
    setFormData({
      bookIndex: '',
      teacherIndex: '',
      title: '',
      type: 'theorem',
      description: '',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Add New Reference
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookIndex" className="text-sm font-medium">
                Book Index *
              </Label>
              <Input
                id="bookIndex"
                value={formData.bookIndex}
                onChange={(e) => handleInputChange('bookIndex', e.target.value)}
                placeholder="e.g., 3.2.1, Chapter 5.3"
                className="font-mono"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacherIndex" className="text-sm font-medium">
                Teacher Index *
              </Label>
              <Input
                id="teacherIndex"
                value={formData.teacherIndex}
                onChange={(e) => handleInputChange('teacherIndex', e.target.value)}
                placeholder="e.g., T-15, Lecture 7"
                className="font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Pythagorean Theorem, Limit Definition"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Type
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theorem">Theorem</SelectItem>
                <SelectItem value="definition">Definition</SelectItem>
                <SelectItem value="proposition">Proposition</SelectItem>
                <SelectItem value="example">Example</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description or notes..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Screenshot (Optional)
            </Label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a screenshot of the textbook content
                </p>
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <Card className="p-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-academic hover:opacity-90"
              disabled={!formData.bookIndex || !formData.teacherIndex || !formData.title}
            >
              Add Reference
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};