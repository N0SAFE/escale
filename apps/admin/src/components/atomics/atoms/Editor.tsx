'use client'

import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import dynamic from 'next/dynamic'
import React from 'react'

const Editor = (
    props: Omit<React.ComponentProps<typeof CKEditor<ClassicEditor>>, 'editor'>
) => {
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted && typeof window === 'undefined') {
        return <span className="ssr-only">Loading editor...</span>
    }

    return (
        <div className="text-black">
            <CKEditor<ClassicEditor> editor={ClassicEditor} {...props} />
        </div>
    )
}

export default Editor
