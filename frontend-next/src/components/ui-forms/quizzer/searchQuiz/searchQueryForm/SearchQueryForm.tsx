import React, { useEffect, useState } from 'react';
import { FormControl, FormGroup } from '@mui/material';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { RangeSliderSection } from '@/components/ui-parts/card-contents/rangeSliderSection/RangeSliderSection';
import {
  GetQuizApiResponseDto,
  initSearchQuizRequestData,
  PullDownOptionDto,
  searchQuizAPI,
  SearchQuizAPIRequestDto
} from 'quizzer-lib';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import { GridRowsProp } from '@mui/x-data-grid';
import { CheckboxGroup } from '@/components/ui-parts/checkboxGroup/CheckboxGroup';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { QuizFilePullDown } from '@/components/ui-elements/pullDown/quizFilePullDown/QuizFilePullDown';
import { useQuizFormatList } from '@/hooks/useQuizFormatList';
import { useSelectedFileChange } from '@/hooks/useSelectedFileChange';
import { getCategoryListOptions } from '@/utils/getCategoryListOptions';

interface SearchQueryFormProps {
  setSearchResult: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const SearchQueryForm = ({ setSearchResult }: SearchQueryFormProps) => {
  const [searchQuizRequestData, setSearchQuizRequestData] =
    useState<SearchQuizAPIRequestDto>(initSearchQuizRequestData);
  const [categorylistoption, setCategorylistoption] = useState<PullDownOptionDto[]>([]);
  const { quizFormatListoption } = useQuizFormatList();
  const setMessage = useSetRecoilState(messageState);

  // セッションストレージキー
  const STORAGE_KEY = 'searchQuizRequestData';

  // 初期化・復元・自動検索
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSearchQuizRequestData(parsed);
        // file_numが有効な場合のみカテゴリリストも取得
        if (parsed.file_num !== -1) {
          (async () => {
            const { pullDownOption } = await getCategoryListOptions(String(parsed.file_num));
            setCategorylistoption(pullDownOption);
          })();

          // 自動検索
          // TODO 下のボタン押した時と処理同じだから、まとめたい
          (async () => {
            setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
            const result = await searchQuizAPI({ searchQuizRequestData: parsed });
            setMessage(result.message);
            if (result.result) {
              const apiResult = (result.result as GetQuizApiResponseDto[]).map((x) => {
                return {
                  ...x,
                  category: x.quiz_category
                    ? x.quiz_category
                        .filter((x) => !x.deleted_at)
                        .map((x) => x.category)
                        .join(',')
                    : '',
                  format_name: x.quiz_format ? x.quiz_format.name.replace('問題', '') : '',
                  accuracy_rate: x.quiz_statistics_view ? +x.quiz_statistics_view.accuracy_rate : NaN
                };
              });
              setSearchResult(apiResult);
            }
          })();
        }
      } catch (e) {
        // パース失敗時は何もしない
      }
    }
  }, [setMessage, setSearchResult]);

  // カテゴリリストが更新されたとき、category値がリストに含まれていなければ-1にリセット
  useEffect(() => {
    if (categorylistoption.length > 0) {
      if (
        searchQuizRequestData.category &&
        !categorylistoption.some((opt) => String(opt.value) === String(searchQuizRequestData.category))
      ) {
        setSearchQuizRequestData((prev) => ({ ...prev, category: '-1' }));
      }
    }
  }, [categorylistoption]);

  return (
    <>
      <FormGroup>
        <QuizFilePullDown
          onFileChange={useSelectedFileChange({ setMessage, setCategorylistoption, setSearchQuizRequestData })}
          value={String(searchQuizRequestData.file_num)}
        />
        <FormControl>
          <TextField
            label="検索語句"
            value={searchQuizRequestData.query}
            setStater={(value: string) => {
              const setData = {
                ...searchQuizRequestData,
                query: value
              };
              setSearchQuizRequestData(setData);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
            }}
          />
        </FormControl>

        <FormGroup row>
          <span style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>検索対象：</span>
          <Checkbox
            value=""
            label="問題"
            checked={!!searchQuizRequestData.searchInOnlySentense}
            onChange={(e) => {
              const setData = {
                ...searchQuizRequestData,
                searchInOnlySentense: e.target.checked
              };
              setSearchQuizRequestData(setData);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
            }}
            name="checkedA"
          />
          <Checkbox
            value=""
            label="答え"
            checked={!!searchQuizRequestData.searchInOnlyAnswer}
            onChange={(e) => {
              const setData = {
                ...searchQuizRequestData,
                searchInOnlyAnswer: e.target.checked
              };
              setSearchQuizRequestData(setData);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
            }}
            name="checkedB"
          />
        </FormGroup>

        <PullDown
          label={'カテゴリ'}
          optionList={categorylistoption}
          value={searchQuizRequestData.category ?? -1}
          onChange={(e) => {
            const setData = {
              ...searchQuizRequestData,
              category: String(e.target.value)
            };
            setSearchQuizRequestData(setData);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
          }}
        />

        <FormControl>
          <RangeSliderSection
            sectionTitle={'正解率(%)指定'}
            value={
              typeof searchQuizRequestData.min_rate === 'number' && typeof searchQuizRequestData.max_rate === 'number'
                ? [searchQuizRequestData.min_rate, searchQuizRequestData.max_rate]
                : [0, 100]
            }
            setStater={(value: number[] | number) => {
              const setData = {
                ...searchQuizRequestData,
                min_rate: Array.isArray(value) ? value[0] : value,
                max_rate: Array.isArray(value) ? value[1] : value
              };
              setSearchQuizRequestData(setData);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
            }}
          />
        </FormControl>

        <FormControl>
          <CheckboxGroup
            checkboxProps={quizFormatListoption.map((x) => {
              return {
                value: String(x.id),
                label: x.name,
                checked: !!(searchQuizRequestData.format_id && searchQuizRequestData.format_id[String(x.id)])
              };
            })}
            setQueryofQuizStater={(checkBoxValue, checked) => {
              const setData = {
                ...searchQuizRequestData,
                format_id: {
                  ...searchQuizRequestData.format_id,
                  [checkBoxValue]: checked
                }
              };
              setSearchQuizRequestData(setData);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
            }}
            label={'問題種別'}
          />
        </FormControl>

        <FormControl>
          <Checkbox
            value="only-checked"
            label="チェック済のみ検索"
            checked={!!searchQuizRequestData.checked}
            onChange={(e) => {
              const setData = {
                ...searchQuizRequestData,
                checked: e.target.checked
              };
              setSearchQuizRequestData(setData);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setData));
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
                      .filter((x) => !x.deleted_at)
                      .map((x) => x.category)
                      .join(',')
                  : '',
                format_name: x.quiz_format ? x.quiz_format.name.replace('問題', '') : '',
                accuracy_rate: x.quiz_statistics_view ? +x.quiz_statistics_view.accuracy_rate : NaN
              };
            });
            setSearchResult(apiResult);
          }
        }}
      />
    </>
  );
};
