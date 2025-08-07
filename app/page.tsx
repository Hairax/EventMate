import { Button } from "@/components/ui/button";
import { AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
 } from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPortal,
  DialogOverlay,
 } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
 } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet,
  SheetTrigger,
  SheetContent,
 } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {

  return (
    <div className="space-y-8 p-8">
      {/* Button */}
      <Button>Click me</Button>

      {/* AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Open Alert</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogAction asChild>
            <Button>Confirm</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      {/* Calendar */}
      <Calendar />

      {/* Card */}
      <Card className="p-4 space-y-4">
        <div>Card content here</div>
      </Card>

      {/* Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="fixed top-1/2 left-1/2 bg-white p-6 rounded shadow -translate-x-1/2 -translate-y-1/2">
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>This is a dialog example.</DialogDescription>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* DropdownMenu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Form */}

      {/* Input */}
      <Input placeholder="Type here..." />

      {/* Label */}
      <Label htmlFor="input-example">Example Label</Label>
      <Input id="input-example" />

      {/* Select */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>

      {/* Textarea */}
      <Textarea placeholder="Type your message..." />

      {/* Toaster */}
      <Toaster />

      {/* Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <h2 className="text-lg font-bold mb-2">Sheet Content</h2>
          <p>This is the content inside the sheet.</p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
