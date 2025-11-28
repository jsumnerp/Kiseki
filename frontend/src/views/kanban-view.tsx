import { Kanban } from "@/components/kanban";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ApplicationModal } from "@/components/application-modal";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

export const KanbanView = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              New Application <PlusCircleIcon />
            </Button>
          </DialogTrigger>
          <ApplicationModal onClose={() => setOpen(false)} />
        </Dialog>
      </div>
      <div className="flex-1 overflow-hidden">
        <Kanban />
      </div>
    </div>
  );
};
