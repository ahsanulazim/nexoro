export const imageHandler = (quillRef) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("folder", "portfolio");
        formData.append("image", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio/portfolioImages`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        // quillRef থেকে editor instance বের করুন
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", data.url);
    };
};