import { cn } from "@/lib/utils";
import React from "react";
import PropsWithChildren from 'react';

export default function Breadcrumbs({ children, className }: React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>>) {
    
    return (
        <div className={className}>
            {React.Children.map(children, (child, index) => {
            if (index === 0) {
                return child;
            }
            return (
                <>
                    <span className="mx-2">/</span>
                    {child}
                </>
            );
        })}
        </div>
    );
}
