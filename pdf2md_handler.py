from digitalhub_runtime_python import handler
from tempfile import TemporaryDirectory

import pymupdf4llm







@handler(outputs=["message"])
def pdf3mdFunction(artifact) -> str:
    with TemporaryDirectory(prefix="pdf-to-md-") as directory:
        pdf_path = artifact.download(destination=directory)

        markdown = pymupdf4llm.to_markdown(
            pdf_path,
            write_images=False,
            embed_images=False,
        )

    print(f"Converted artifact: {artifact.name}")
    return markdown
