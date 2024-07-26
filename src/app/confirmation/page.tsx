import Loading from "@/components/Loading";

type Props = {
    searchParams: {
        success: string
    }
}
const Page: React.FC<Props> = ({ searchParams: { success }}) => {
    return success ? (
        <div>
            THANK YOU
        </div>
    ) : <Loading />
}

export default Page;