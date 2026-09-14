import QuestionsInfo from "@/src/features/questions/_components/questions-info"


const page = async ({params} : {params : Promise<{id : string ; diplomaId : string;}>}) => {

  const {id , diplomaId} = await params

  return (
    <QuestionsInfo id={id} diplomaId={diplomaId} />
  )
}

export default page