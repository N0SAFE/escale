// the T generics on the typed model is used to define where the model is the top level called
// if i get the mode Spa i want to have some extra prop that are not fetch by default

export type File = {
  id: number;
  uuid: string;
  name: string;
  extname: string;
  size: number;
  path: string;
};

export type Image<T extends boolean = false> = {
  id: number;
  alt: string;
  file: File;
};

export type MutatedImage = Partial<Omit<Image, "id" | "file">> & {
  name?: string;
};

export type SpaImage = {
  id: number;
  order: number;
  image: Image;
};

export type NewSpaImage = Omit<SpaImage, "id">;

export type Spa<T extends boolean = false> = {
  id: number;
  title: string;
  description: string;
  location: string;
  google_maps_link: string;
  spaImages: SpaImage[];
};

export type MutatedSpa = Partial<Omit<Spa, "id">>;

export type NewSpa = Omit<Spa, "id" | "spaImage">;

export type Service<T extends boolean = false> = {
  id: number;
  label: string;
  description: string;
  image?: Image;
};

export type MutatedService = Partial<Omit<Service, "id" | "image">> & {
  image?: Image | null;
};

export type NewService = Omit<Service, "id" | "image">;
