import { ApiResult, get } from '../../api'
import { GetCategoryAPIResponseDto, GetCategoryListAPIRequestDto } from '.'
import { ProcessingApiReponse, PullDownOptionDto } from '../../..'

interface GetCategoryListAPIProps {
  getCategoryListData: GetCategoryListAPIRequestDto
}

export const getCategoryListAPI = async ({
  getCategoryListData
}: GetCategoryListAPIProps): Promise<ApiResult> => {
  const result = await get(
    '/category',
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        const result: GetCategoryAPIResponseDto[] =
          data.body as GetCategoryAPIResponseDto[]
        // let categorylist: PullDownOptionDto[] = []
        // for (var i = 0; i < res.length; i++) {
        //   categorylist.push({
        //     value: res[i].category,
        //     label: res[i].category
        //   })
        // }
        // setCategorylistoption(categorylist)
        return {
          message: {
            message: '　',
            messageColor: 'common.black',
            isDisplay: false
          },
          result
        }
      } else {
        return {
          message: {
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error',
            isDisplay: true
          }
        }
      }
    },
    { ...getCategoryListData }
  )
  return result
}
