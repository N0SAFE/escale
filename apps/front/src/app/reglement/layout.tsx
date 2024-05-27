import { Separator } from '@/components/ui/separator'

export default function layout({ children }: React.PropsWithChildren<{}>) {
    return (
        <main className="flex grow flex-col">
            <section className="bg-[url('/canap.jpg')] bg-center">
                <div className="flex flex-col items-center justify-center p-36 font-bold italic text-slate-50">
                    <div className="w-fit gap-2">
                        <h1 className="w-fit font-allura text-7xl">
                            Reglement
                        </h1>
                        <Separator className="h-[2px]" />
                    </div>
                </div>
            </section>
            <section className="flex grow flex-col">{children}</section>
        </main>
    )
}
