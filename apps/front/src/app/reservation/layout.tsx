import { Suspense } from "react";
import Loader from "@/components/Loader";

export default function layout({ children }: React.PropsWithChildren<{}>) {
    return (
        <main className="grow flex flex-col">
            <section className="bg-[url('https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg')] bg-center">
                <div className="p-36 flex text-slate-50 justify-center italic font-bold ">
                    <h1 className="text-7xl font-allura">Réservations</h1>
                </div>
            </section>
            <section className="grow flex flex-col">
                <Suspense fallback={<Loader />}>
                    {children}
                </Suspense>
            </section>
        </main>
    )
}