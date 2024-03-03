"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SortableList } from "@/components/SortableList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getSpa, getImagesBySpa } from "../../actions";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { updateSpa } from "./actions";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import {
  MutatedService,
  MutatedSpa,
  SpaImage as SpaImageType,
} from "@/types/index";
import { getImages } from "../../../actions";
import ApiImage from "@/components/ApiImage";
import Combobox from "@/components/Combobox";
import { useDragControls, Reorder } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function SpasEdit() {
  const [isLoading, setIsLoading] = useState(true);
  const [spaState, setSpaState] = useState<MutatedSpa>();

  const params = useParams<{ id: string }>();

  const { data: images, isFetched: isImagesFetched } = useQuery({
    queryKey: ["images"],
    queryFn: async () => getImages(),
  });
  const { data: spaData } = useQuery({
    queryKey: ["spa", +params.id],
    queryFn: async () => getSpa(+params.id),
  });
  const spaMutation = useMutation({
    mutationFn: async (spaState: MutatedSpa) => {
      console.log(spaState);
      return await updateSpa(+params.id, spaState);
    },
    onError: (error) => {
      toast.error("server error");
    },
    onSuccess: (data) => {
      toast.success("spa updated");
    },
  });

  useEffect(() => {
    setSpaState(spaData?.data);
  }, [spaData]);

  const renderItem = (item: SpaImageType) => (
    <Card className="flex items-center justify-between w-full p-4">
      <div className="flex items-center gap-4">
        <ApiImage
          identifier={item.image.id}
          width={50}
          height={50}
          alt={item.image.file.name}
        />
        <span>{item.image.file.name}</span>
      </div>
    </Card>
  );

  const onImageSelect = (ids: number[]) => {
    let maxOrder = Math.max(
      0,
      ...(spaState?.spaImages?.map((i) => i.order) || [])
    );
    const newSpaImages = ids.map((id, index) => {
      const exist = spaState?.spaImages?.find((i) => i.image.id === id);
      if (exist) {
        return exist;
      }
      maxOrder++;
      return {
        order: maxOrder,
        image: images?.data?.find((i) => i.id === id)!,
      } as SpaImageType;
    });

    setSpaState({ ...spaState!, spaImages: newSpaImages });
  };

  const handleReorder = function (spaImages: SpaImageType[]) {
    const newSpaImages = spaImages.map((item, index) => {
      item.order = index + 1;
      return item;
    });
    setSpaState({ ...spaState!, spaImages: newSpaImages });
  };

  const fileSelectItems = useMemo(
    () =>
      images?.data?.map((image) => {
        return {
          component: (
            <span>
              <ApiImage
                identifier={image.id}
                width={50}
                height={50}
                alt={"test"}
              />
            </span>
          ),
          label: image.file.name,
          value: image.id,
        };
      }),
    [images]
  );

  useEffect(() => {
    if (spaMutation.error) {
      toast.error("Failed to update spa");
    }
    if (spaMutation.isSuccess) {
      toast.success("Spa updated successfully");
    }
  }, [spaMutation.error, spaMutation.isSuccess]);

  useEffect(() => {
    console.log(spaState);
  }, [spaState]);

  console.log(spaState?.spaImages);

  return (
    <>
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          isLoading ? "" : "hidden"
        )}
      >
        <Loader />
      </div>
      <div className={cn("w-full h-full", isLoading ? "hidden" : "")}>
        <Tabs
          defaultValue="account"
          className="w-[inherit] flex flex-col items-center h-full"
        >
          <TabsList className="w-fit">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="availabilities">Availabilities</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>
          <div className="w-[inherit] pt-8 h-full">
            <TabsContent
              value="account"
              className="flex items-center justify-between flex-col h-full"
            >
              <ScrollArea className="w-full h-full">
                <div className="flex gap-4 justify-between w-full px-8">
                  <div className="flex flex-col gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        value={spaState?.title}
                        onChange={(e) =>
                          setSpaState({ ...spaState, title: e.target.value })
                        }
                        id="title"
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="description">Description</Label>
                      <Editor
                        onReady={() => {
                          console.log("ready");
                          setIsLoading(false);
                        }}
                        data={spaState?.description}
                        onChange={(event, editor) => {
                          setSpaState({
                            ...spaState,
                            description: editor.getData(),
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col w-full">
                      <Label htmlFor="description">description</Label>
                      <Combobox
                        multiple
                        items={fileSelectItems || []}
                        isLoading={!isImagesFetched}
                        defaultPreviewText="Select an image..."
                        defaultSearchText="Search for an image..."
                        value={spaState?.spaImages?.map((i) => i.image.id)}
                        onSelect={onImageSelect}
                        keepOpen
                      />
                      <ScrollArea className="h-96">
                        <Reorder.Group
                          axis="y"
                          values={spaState?.spaImages || []}
                          onReorder={handleReorder}
                          layoutScroll
                        >
                          {spaState?.spaImages?.map((item, index) => (
                            <Reorder.Item value={item} key={item.id}>
                              <div data-id={index} style={{ cursor: "grab" }}>
                                {renderItem(item)}
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex justify-end w-full">
                <Button onClick={() => spaMutation.mutate(spaState!)}>
                  Save
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="availabilities">
              Change availabilities here.
            </TabsContent>
            <TabsContent value="reservations">
              Change reservations here.
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
