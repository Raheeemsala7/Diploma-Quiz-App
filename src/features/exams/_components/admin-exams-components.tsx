"use client"
import {  PaginationExams } from './pagination-exams'
import { useExamsAdmin } from '../hooks/hooks'
import { SearchFilters } from './search-filter'
import ExamsTable from './exams-table'

const AdminExamsComponents = () => {

    const { data, isLoading, isFetching ,isPending } = useExamsAdmin()

    const examsData = data?.data
    const examsMeta = data?.metadata






    return (
        <>
            <PaginationExams currentPage={examsMeta?.page || 1} limit={examsMeta?.limit || 12} totalItems={examsMeta?.total || 12} totalPages={examsMeta?.totalPages || 1} />
            <div className="space-y-4">
                <SearchFilters />
                <ExamsTable isFetching={isFetching} isLoading={isLoading} isPending={isPending} exams={examsData || []} />
            </div>
        </>
    )
}

export default AdminExamsComponents