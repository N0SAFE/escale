import React from "react";
import "./style.css";

type Props = {
    minHeight?: string;
};

export default function Loader({ minHeight = "500px" }: Props) {
    return (
        <>
            <div className={`h-fit w-full flex justify-center items-center m-0 p-0 bg-[#00000011] min-h-[${minHeight}] grow`}>
                <div className="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    );
}
