import React, { useEffect, useState } from 'react';
import { Checkbox as MuiCheckBox, FormControl, FormControlLabel, FormGroup, SelectChangeEvent } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import {
  GetCategoryAPIResponseDto,
  getCategoryListAPI,
  getCategoryListAPIResponseToPullDownAdapter,
  GetQuizApiResponseDto,
  GetQuizFileApiResponseDto,
  getQuizFileListAPI,
  GetQuizFormatApiResponseDto,
  getQuizFormatListAPI,
  PullDownOptionDto,
  quizFileListAPIResponseToPullDownAdapter,
  searchQuizAPI,
  SearchQuizAPIRequestDto
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import { GridRowsProp } from '@mui/x-data-grid';
import { CheckboxGroup } from '@/components/ui-parts/checkboxGroup/CheckboxGroup';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';

interface SearchQueryFormProps {
  searchQuizRequestData: SearchQuizAPIRequestDto;
  setSearchResult: React.Dispatch<React.SetStateAction<GridRowsProp>>;
  setSearchQuizRequestData: React.Dispatch<React.SetStateAction<SearchQuizAPIRequestDto>>;
}

export const SearchQueryForm = ({
  searchQuizRequestData,
  setSearchResult,
  setSearchQuizRequestData
}: SearchQueryFormProps) => {
  const [filelistoption, setFilelistoption] = useState<PullDownOptionDto[]>([]);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const [quizFormatListoption, setQuizFormatListoption] = useState<GetQuizFormatApiResponseDto[]>([]);

  const setMessage = useSetRecoilState(messageState);

  useEffect(() => {
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFileListAPI();
      setMessage(result.message);
      const pullDownOption = result.result
        ? quizFileListAPIResponseToPullDownAdapter(result.result as GetQuizFileApiResponseDto[])
        : [];
      setFilelistoption(pullDownOption);
    })();
  }, [setMessage]);

  // 問題形式リスト取得
  useEffect(() => {
    // TODO これ　別関数にしたい
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getQuizFormatListAPI();
      setMessage(result.message);
      setQuizFormatListoption(result.result ? (result.result as GetQuizFormatApiResponseDto[]) : []);
    })();
  }, [setMessage]);

  const selectedFileChange = (e: SelectChangeEvent<number>) => {
    // TODO カテゴリリスト取得 これ　別関数にしたい　というよりこのselectedFileChangeをlibとかに持ってきたい getQuizにもこの関数あるので
    (async () => {
      setMessage({
        message: '通信中...',
        messageColor: '#d3d3d3',
        isDisplay: true
      });
      const result = await getCategoryListAPI({ getCategoryListData: { file_num: String(e.target.value) } });
      setSearchQuizRequestData({
        ...searchQuizRequestData,
        file_num: +e.target.value
      });
      setMessage(result.message);
      const pullDownOption = result.result
        ? getCategoryListAPIResponseToPullDownAdapter(result.result as GetCategoryAPIResponseDto[])
        : [];
      setCategorylistoption(pullDownOption);
    })();
  };

  return (
    <>
      <FormGroup>
        <PullDown label={'問題ファイル'} optionList={filelistoption} onChange={selectedFileChange} />
        <FormControl>
          <TextField
            label="検索語句"
            setStater={(value: string) => {
              setSearchQuizRequestData({
                ...searchQuizRequestData,
                query: value
              });
            }}
          />
        </FormControl>

        <FormGroup row>
          検索対象：
          <FormControlLabel
            control={
              /**TODO ここ　muiじゃなくて作ったcheckboxコンポーネントにして */
              <MuiCheckBox
                onChange={(e) => {
                  setSearchQuizRequestData({
                    ...searchQuizRequestData,
                    searchInOnlySentense: e.target.checked
                  });
                }}
                name="checkedA"
              />
            }
            label="問題"
          />
          <FormControlLabel
            control={
              <MuiCheckBox
                onChange={(e) => {
                  setSearchQuizRequestData({
                    ...searchQuizRequestData,
                    searchInOnlyAnswer: e.target.checked
                  });
                }}
                name="checkedB"
              />
            }
            label="答え"
          />
        </FormGroup>

        <PullDown
          label={'カテゴリ'}
          optionList={categorylistoption}
          onChange={(e) => {
            setSearchQuizRequestData({
              ...searchQuizRequestData,
              category: String(e.target.value)
            });
          }}
        />

        <FormControl>
          <RangeSliderSection
            sectionTitle={'正解率(%)指定'}
            setStater={(value: number[] | number) => {
              setSearchQuizRequestData({
                ...searchQuizRequestData,
                min_rate: Array.isArray(value) ? value[0] : value,
                max_rate: Array.isArray(value) ? value[1] : value
              });
            }}
          />
        </FormControl>

        <FormControl>
          <CheckboxGroup
            checkboxProps={quizFormatListoption.map((x) => {
              return {
                value: String(x.id),
                label: x.name
              };
            })}
            setQueryofQuizStater={(checkBoxValue, checked) => {
              setSearchQuizRequestData({
                ...searchQuizRequestData,
                format_id: {
                  ...searchQuizRequestData.format_id,
                  [checkBoxValue]: checked
                }
              });
            }}
            label={'問題種別'}
          />
        </FormControl>

        <FormControl>
          <Checkbox
            value="only-checked"
            label="チェック済のみ検索"
            onChange={(e) => {
              setSearchQuizRequestData({
                ...searchQuizRequestData,
                checked: e.target.checked
              });
            }}
          />
        </FormControl>
      </FormGroup>
      <Button
        label={'検索'}
        disabled={searchQuizRequestData.file_num === -1}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await searchQuizAPI({ searchQuizRequestData });
          setMessage(result.message);
          if (result.result) {
            const apiResult = (result.result as GetQuizApiResponseDto[]).map((x) => {
              return {
                ...x,
                category: x.quiz_category
                  ? x.quiz_category
                      .filter((x) => {
                        return !x.deleted_at;
                      })
                      .map((x) => {
                        return x.category;
                      })
                      .join(',')
                  : '',
                format_name: x.quiz_format ? x.quiz_format.name.replace('問題', '') : ''
              };
            });
            setSearchResult(apiResult);
          }
        }}
      />
    </>
  );
};
