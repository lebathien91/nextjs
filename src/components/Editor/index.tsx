import { GlobalContext } from "@/store/GlobalState";
import { checkImage, uploadImage } from "@/utils/uploadImage";
import { useState, useRef, useEffect, useContext } from "react";

import { defaultConfig } from "./config";

const Editor = ({ body, setBody }: { body: string; setBody: Function }) => {
  const [editorLoader, setEdiorLoaded] = useState(false);
  const { state, dispatch } = useContext(GlobalContext);

  const editorRef = useRef<any>();

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("./CkEditor.js"),
    };

    setEdiorLoaded(true);
  }, []);

  const { CKEditor, Editor } = editorRef.current || {};

  const uploadAdapter = (loader: any) => {
    return {
      upload: async () => {
        try {
          dispatch({ type: "NOTIFY", payload: { loading: true } });
          const file = await loader.file;

          const check = checkImage(file);

          if (check) {
            dispatch({ type: "NOTIFY", payload: { error: check } });
            return {
              default: "/imageUrlDefault.jpg",
            };
          }

          const image = await uploadImage(file, "Articles");

          dispatch({ type: "NOTIFY", payload: {} });

          return {
            default: image.url,
          };
        } catch (error: any) {
          console.log({ error: error.message });
          return {
            default: "/imageUrlDefault.jpg",
          };
        }
      },
    };
  };

  const uploadPlugin = (editor: any) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return uploadAdapter(loader);
    };
  };

  return (
    <div className="mt-3">
      {editorLoader ? (
        <CKEditor
          config={{
            ...defaultConfig,
            extraPlugins: [uploadPlugin],
          }}
          editor={Editor}
          data={body}
          onChange={(event: HTMLElement, editor: any) => {
            const data = editor.getData();
            setBody(data);
          }}
        />
      ) : (
        <div>Editor Loadding... </div>
      )}
    </div>
  );
};

export default Editor;
