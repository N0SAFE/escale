import { List } from '@/components/List'
import Loader from '@/components/Loader/index'
import { xiorInstance } from '@/utils/xiorInstance'
import { useQuery } from '@tanstack/react-query'

type Rule = {
    rule: string
}

export default async function Reglement() {
    const { data } = await xiorInstance.get<Rule[]>('/rules', {
        cache: 'no-store',
    })

    return (
        <div className="mb-16 mt-4">
            <div className="flex items-center justify-center">
                <h1 className="text-xl">RÈGLEMENT INTÉRIEUR</h1>
            </div>
            <div className="flex items-center justify-center mt-8">
                <div className="md:px-4 md:max-w-[80%] lg:max-w-[60%] w-full">
                    <List items={data?.map((ruleObj) => ruleObj.rule)!} />
                </div>
            </div>
        </div>
    )
}
