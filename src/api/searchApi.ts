import type { SearchResponseDTO } from "../types/search";
import emptyApi from "./emptyApi";

interface SearchParams {
    query: string;
    page?: number;
    size?: number;
}

export const searchApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({
        getGlobalSearch: build.query<SearchResponseDTO, SearchParams>({
            query: ({query, page = 0, size = 10}) => ({
                url: "/search",
                method: "GET",
                params: {
                    q: query,
                    page,
                    size,
                },
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetGlobalSearchQuery
} =  searchApi;