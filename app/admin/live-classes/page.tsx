"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, Users, Clock, Square, Play } from "lucide-react";
import { useGetQuery, useMutationQuery } from "@/hooks/react-query/hooks/queryHooks";
import { queryConfig } from "@/hooks/react-query/queryConfig";
import { showNotification } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TClassLink } from "@/lib/types/types";

interface ClassLink {
  course_id: number;
  live_link: string;
  topic: string;
  created_on: string;
  course_title: string;
  subject: string;
  board_type: string;
  grade_level: string | null;
  instructor_name: string | null;
}

interface QueryResponse {
  result: {
    count: number;
    list: ClassLink[];
  };
  success: boolean;
}

export default function LiveClassesPage() {
  const {
    data: linksdata,
    isLoading,
    isFetched,
  } = useGetQuery({
    key: queryConfig.useListClassLinks.queryKeys,
    func: queryConfig.useListClassLinks.queryFn,
    params: { offset: 0, limit: 100 },
  });

  const { mutate: clearLinkFunc } = useMutationQuery({
    func: queryConfig.useClearClassLink.queryFn,
    invalidateKey: queryConfig.useClearClassLink.queryKeys,
    onSuccess() {
      showNotification("success", "Link Cleared Successfully");
    },
    onError: () => {
      showNotification("error", "Failed to clear link");
    },
  });

  const { mutate: updateLinkFunc } = useMutationQuery({
    func: queryConfig.useUpdateClassLink.queryFn,
    invalidateKey: queryConfig.useUpdateClassLink.queryKeys,
    onSuccess() {
      showNotification("success", "Link Updated Successfully");
    },
    onError: () => {
      showNotification("error", "Failed to update link");
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [newLiveLink, setNewLiveLink] = useState("");

  const handleClearLink = (id: number) => {
    if (id) {
      clearLinkFunc(id);
    }
  };

  const handleOpenUpdateModal = (courseId: number, currentLink: string) => {
    setSelectedCourseId(courseId);
    setNewLiveLink(currentLink);
    setIsModalOpen(true);
  };

  const handleUpdateLink = () => {
    if (selectedCourseId && newLiveLink) {
      // updateLinkFunc( id: selectedCourseId, body: {live_link: newLiveLink });
      updateLinkFunc({ id: selectedCourseId, body: { live_link: newLiveLink } });
      setIsModalOpen(false);
      setNewLiveLink("");
      setSelectedCourseId(null);
    }
  };

  const getStatusColor = (createdDate: string): string => {
    const now = new Date();
    const classDate = new Date(createdDate);
    const isToday = now.toDateString() === classDate.toDateString();
    if (isToday && now >= classDate) {
      return "bg-red-100 text-red-800 animate-pulse";
    } else if (classDate > now) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (createdDate: string) => {
    const now = new Date();
    const classDate = new Date(createdDate);
    const isToday = now.toDateString() === classDate.toDateString();
    if (isToday && now >= classDate) {
      return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
    } else if (classDate > now) {
      return <Clock className="h-3 w-3" />;
    } else {
      return <Square className="h-3 w-3" />;
    }
  };

  const getStatusText = (createdDate: string): string => {
    const now = new Date();
    const classDate = new Date(createdDate);
    const isToday = now.toDateString() === classDate.toDateString();
    if (isToday && now >= classDate) {
      return "Live";
    } else if (classDate > now) {
      return "Scheduled";
    } else {
      return "Completed";
    }
  };

  if (isLoading || !isFetched) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-lg">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-gray-600 mt-2">Manage and monitor live class sessions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{linksdata?.result?.count || 0}</div>
                <p className="text-sm text-gray-600">Total Classes</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {linksdata?.result?.list?.map((liveClass: TClassLink) => (
          <Card key={liveClass.course_id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{liveClass.topic}</h3>
                    <Badge className={`${getStatusColor(liveClass.created_on)} flex items-center gap-1`}>
                      {getStatusIcon(liveClass.created_on)}
                      {getStatusText(liveClass.created_on)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Course:</strong> {liveClass.course_title}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Instructor:</strong> {liveClass.instructor_name || "TBD"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(liveClass.created_on).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Time:</strong> {new Date(liveClass.created_on).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Subject:</strong> {liveClass.subject}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Board:</strong> {liveClass.board_type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {liveClass.live_link && (
                      <Button variant="outline" size="sm" onClick={() => handleClearLink(liveClass.course_id)}>
                        Clear Link
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleOpenUpdateModal(liveClass.course_id, liveClass.live_link)}>
                      Update Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {linksdata?.result?.list?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Video className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">No live classes are available at the moment.</p>
          </CardContent>
        </Card>
      )}

      {/* Update Link Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Live Class Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="liveLink">New Live Link</Label>
              <Input id="liveLink" value={newLiveLink} onChange={(e) => setNewLiveLink(e.target.value)} placeholder="Enter new live class link" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLink} disabled={!newLiveLink}>
              Update Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
