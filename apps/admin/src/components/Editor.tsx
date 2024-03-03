import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

const Editor = (
  props: Omit<React.ComponentProps<typeof CKEditor<ClassicEditor>>, "editor">
) => {
  return <CKEditor<ClassicEditor> editor={ClassicEditor} {...props} />;
};

export default Editor;
