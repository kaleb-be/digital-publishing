import React, {useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
type TinyEditorProps = {
  name: string;
  defaultValue?: string;
  onChangeAction?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
};

export default function TinyEditor({name,defaultValue="", onChangeAction, placeholder="Write your chapter...", className, editable=true}: TinyEditorProps) {
  const [markdownValue, setMarkdownValue] = useState(defaultValue);
  const [content, setContent] = useState(defaultValue);
  return (
    <>
    <Editor
      apiKey={TINYMCE_API_KEY}
      init={{
        plugins: [
          // Core editing features
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount','autosave', 'fullscreen', 'help'
          // Try the premium features IF PAID FOR :
          // 'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
        ],
        menubar: 'file tool table help',
        toolbar: 'undo redo fullscreen  bold italic  underline strikethrough  table' +
          ' mergetags  indent outdent searchreplace removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        // ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
        uploadcare_public_key: 'be6798d7868d35536c1c',//not used  no idea what to do with this
        skin: 'fabric',
        icons: 'material',
        promotion: false,
        onboarding: false,
        help_tabs:[
        'shortcuts',
        'keyboardnav']

      }}
      initialValue={defaultValue}
      onEditorChange={(content) => {
        setContent(content);
        onChangeAction?.(content);
      }}
    />
  {/* This is used to submit the content*/}
  <input type="hidden" name={name} value={content} readOnly />
</>
);
}