import { Separator } from '@/components/ui/separator'

export default function layout({ children }: React.PropsWithChildren<{}>) {
    return (
        <main className="grow flex flex-col">
            <section className="bg-[url('/canap.jpg')] bg-center">
                <div className="p-36 flex text-slate-50 justify-center italic font-bold flex-col items-center">
                    <div className="w-fit gap-2">
                        <h1 className="text-7xl font-allura w-fit">
                            Reglement
                        </h1>
                        <Separator className="h-[2px]" />
                    </div>
                </div>
            </section>
            <section className="grow flex flex-col">{children}</section>
        </main>
    )
}
