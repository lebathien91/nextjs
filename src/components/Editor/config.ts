export const fullToolbar = {
  items: [
    "style",
    "heading",
    "|",
    "fontFamily",
    "fontSize",
    "fontColor",
    "fontBackgroundColor",
    "highlight",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "subscript",
    "superscript",
    "link",
    "horizontalLine",
    "|",
    "alignment",
    "outdent",
    "indent",
    "bulletedList",
    "numberedList",
    "todoList",
    "|",
    "codeBlock",
    "code",
    "findAndReplace",
    "|",
    "imageInsert",
    // "CKFinder",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "|",
    "undo",
    "redo",
    "|",
    "specialCharacters",
    // "pageBreak",
    "removeFormat",
    // "restrictedEditingException",
  ],
  shouldNotGroupWhenFull: true,
};

export const quickToolbar = {
  items: [
    "bold",
    "italic",
    "|",
    "undo",
    "redo",
    "|",
    "numberedList",
    "bulletedList",
  ],
  removeItems: [],
  shouldNotGroupWhenFull: true,
};

export const defaultConfig = {
  toolbar: fullToolbar,

  // Style - định dạng theo style cho sẵn
  style: {
    definitions: [
      {
        name: "Title",
        element: "h1",
        classes: ["title"],
      },
      {
        name: "Sub Title",
        element: "p",
        classes: ["info-box"],
      },
    ],
  },
  // Heading - tiêu đề
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },

  // FontSize - kích thước chữ
  fontSize: {
    options: [9, 10, 11, 12, 13, 14, "default", 15, 16, 17, 18, 19, 20, 21],
    supportAllValues: true,
  },

  // Image - ảnh
  image: {
    styles: ["alignCenter", "alignLeft", "alignRight"],
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null,
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50",
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75",
      },
    ],
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "|",
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "imageStyle:side",
      "|",
      "resizeImage",
    ],
    insert: {
      integrations: ["insertImageViaUrl"],
    },
  },

  // List - danh sách
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },

  // Link - Liên kết
  link: {
    decorators: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
    },
  },

  mention: {
    feeds: [
      {
        marker: "@",
        feed: [
          "@apple",
          "@bears",
          "@brownie",
          "@cake",
          "@cake",
          "@candy",
          "@canes",
          "@chocolate",
          "@cookie",
          "@cotton",
          "@cream",
          "@cupcake",
          "@danish",
          "@donut",
          "@dragée",
          "@fruitcake",
          "@gingerbread",
          "@gummi",
          "@ice",
          "@jelly-o",
          "@liquorice",
          "@macaroon",
          "@marzipan",
          "@oat",
          "@pie",
          "@plum",
          "@pudding",
          "@sesame",
          "@snaps",
          "@soufflé",
          "@sugar",
          "@sweet",
          "@topping",
          "@wafer",
        ],
        minimumCharacters: 1,
      },
    ],
  },
  placeholder: "Nhập hoặc dán nội dung của bạn ở đây!",

  // Table - bảng
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableProperties",
      "tableCellProperties",
      "toggleTableCaption",
    ],
  },
};
