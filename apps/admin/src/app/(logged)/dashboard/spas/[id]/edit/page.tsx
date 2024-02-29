"use client";

import React, { useEffect, useRef, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { SortableList } from "@/components/SortableList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { SpaImage as SpaImageType, Spa, getSpa, getImagesBySpa } from "../../actions";
import Loader from "@/components/loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MutatedSpa, addImages, deleteImage, setSpa, sortImages } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploader from "@/components/FileUploader";
import {
    AlertDialogContent,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

type Size = `${number}b` | `${number}kb` | `${number}mb` | `${number}gb`;

function fromBytes(bytes: number): Size {
    const units = ["b", "kb", "mb", "gb"];
    let value = bytes;
    let unit = 0;
    while (value > 1024) {
        value /= 1024;
        unit++;
    }
    return `${value.toFixed()}${units[unit]}` as Size;
}

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function SpasEdit() {
    const [isLoading, setIsLoading] = useState(true);

    const params = useParams<{ id: string }>();

    const {
        data: spaImages,
        error,
        isFetched: isSpaImagesFetched,
        refetch: refretchSpaImages
    } = useQuery({
        queryKey: ["spa", "image", +params.id],
        queryFn: async () => getImagesBySpa(+params.id)
    });
    const { data: spaData } = useQuery({
        queryKey: ["spa", +params.id],
        queryFn: async () => getSpa(+params.id)
    });
    const spaMutation = useMutation({
        mutationFn: async () => setSpa(+params.id, spaState)
    });

    const [spaState, setSpaState] = useState<MutatedSpa>();
    const [isSpaImagesLoading, setIsSpaImagesLoading] = useState(!isSpaImagesFetched);

    useEffect(() => {
        setSpaState(spaData?.data);
    }, [spaData]);
    useEffect(() => {
        setIsSpaImagesLoading(!isSpaImagesFetched);
    }, [isSpaImagesFetched]);

    const handleSort = async (s: { id: number; order: number }[]) => {
        await sortImages(+params.id, s);
        await refretchSpaImages();
    };
    const handleUpload = async (f: FormData) => {
        await addImages(+params.id, f);
        await refretchSpaImages();
    };
    const handleDelete = async (item: SpaImageType) => {
        await deleteImage(+params.id, item.id);
        await refretchSpaImages();
    };
    const renderItem = (item: SpaImageType) => <RenderedItem item={item} onDelete={handleDelete} />;

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

    return (
        <>
            <div className={cn("w-full h-full flex items-center justify-center", isLoading ? "" : "hidden")}>
                <Loader />
            </div>
            <div className={cn("w-full", isLoading ? "hidden" : "")}>
                <Tabs defaultValue="account" className="w-[inherit] flex flex-col justify-center items-center">
                    <TabsList className="w-fit absolute top-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="availabilities">Availabilities</TabsTrigger>
                        <TabsTrigger value="reservations">Reservations</TabsTrigger>
                    </TabsList>
                    <div className="w-[inherit] pt-8">
                        <TabsContent value="account" className="flex items-center justify-center">
                            <div className="flex gap-4 justify-between w-full px-8">
                                <div className="flex flex-col gap-4">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="title">Title</Label>
                                        <Input value={spaState?.title} onChange={(e) => setSpaState({ ...spaState, title: e.target.value })} id="title" />
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
                                                setSpaState({ ...spaState, description: editor.getData() });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <FileUploader
                                        className="w-[400px] h-[500px]"
                                        data={spaImages?.data}
                                        isLoading={isSpaImagesLoading}
                                        renderItem={renderItem}
                                        onSort={handleSort}
                                        onUpload={handleUpload}
                                        onUploadStart={() => setIsSpaImagesLoading(true)}
                                        onUploadEnd={() => setIsSpaImagesLoading(false)}
                                        onSortStart={() => setIsSpaImagesLoading(true)}
                                        onSortEnd={() => setIsSpaImagesLoading(false)}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="availabilities">Change availabilities here.</TabsContent>
                        <TabsContent value="reservations">Change reservations here.</TabsContent>
                    </div>
                </Tabs>
            </div>
        </>
    );
}

function RenderedItem({ item, onDelete, onDeleteStart, onDeleteEnd }: { item: SpaImageType; onDelete?: (item: SpaImageType) => Promise<void>; onDeleteStart?: () => void; onDeleteEnd?: () => void }) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function HandleDelete() {
        setIsDeleting(true);
        onDeleteStart?.();
        await onDelete?.(item);
        onDeleteEnd?.();
        setIsDeleting(false);
    }

    return (
        <div className="relative w-full pb-5">
            <div className="text-sm text-gray-500 absolute right-0 bottom-0 z-1">{fromBytes(item.image.file.size)}</div>
            <div className="flex gap-2 w-full z-0">
                <div className="flex-1 grid gap-1">
                    <div className="flex items-center justify-between gab-3">
                        <div className="font-medium">{item.image.file.name}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger>
                                <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white">
                                    Remove
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button size="sm" disabled={isDeleting} className={cn("hover:bg-red-500 text-white flex gap-2", isDeleting ? "bg-red-400" : "bg-red-600")} onClick={HandleDelete}>
                                        {isDeleting && <Loader size="4" />}Remove
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <SortableList.DragHandle />
            </div>
        </div>
    );
}
