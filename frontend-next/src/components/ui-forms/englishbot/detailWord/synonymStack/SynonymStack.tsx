import { Button } from '@/components/ui-elements/button/Button';
import { Card } from '@/components/ui-elements/card/Card';
import { Item } from '@/components/ui-elements/item/Item';
import { Modal } from '@/components/ui-elements/modal/Modal';
import { Box, CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { MessageState } from '../../../../../../interfaces/state';
import { style } from '../Stack.style';
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  GetWordDetailAPIResponseDto,
  getWordDetailAPI,
  AddSynonymGroupAPIRequestDto,
  addSynonymGroupAPI
} from 'quizzer-lib';

interface SynonymStackProps {
  wordDetail: GetWordDetailAPIResponseDto;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setWordDetail?: React.Dispatch<React.SetStateAction<GetWordDetailAPIResponseDto>>;
}

export const SynonymStack = ({ wordDetail, setMessage, setWordDetail }: SynonymStackProps) => {
  //   const initEditWordSubSourceData = {
  //     id: -1,
  //     wordId: -1,
  //     subSource: ''
  //   };
  //   const [subSourceModalOpen, setSubSourceModalOpen] = useState(false);
  //   const [editWordSubSourceData, setEditWordSubSourceData] =
  //     useState<EditWordSubSourceAPIRequestDto>(initEditWordSubSourceData);
  const [synonymModalOpen, setSynonymModalOpen] = useState<boolean>(false);
  const [addSynonymGroupData, setAddSynonymGroupData] = useState<AddSynonymGroupAPIRequestDto>({
    synonymGroupName: '',
    wordId: wordDetail.id
  });

  const handleOpen = (index: number) => {
    // setEditWordSubSourceData({
    //   id: index === -1 ? index : wordDetail.word_subsource[index].id,
    //   wordId: wordDetail.id,
    //   subSource: index === -1 ? '' : wordDetail.word_subsource[index].subsource
    // });
    setSynonymModalOpen(true);
  };

  return (
    <>
      <Card variant="outlined" attr={'silver-card'}>
        <Typography align="left" variant="h4" component="p">
          {'類義語'}
        </Typography>
        <Box sx={{ width: '100%', padding: '4px' }}>
          {wordDetail.id === -1 ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              {wordDetail.synonym && wordDetail.synonym.length > 0 ? (
                wordDetail.synonym.map((x, index) => {
                  return (
                    <>
                      {x.synonym_group.synonym.map((t, tindex) => {
                        return t.word_id !== wordDetail.id ? (
                          // eslint-disable-next-line react/jsx-key
                          <Item key={t.word_id}>
                            <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography component="div">
                                <Typography align="left" variant="h5" component="p">
                                  {t.word.name}
                                </Typography>
                              </Typography>
                              {/* <Typography component="div" sx={{ marginLeft: 'auto' }}>
                          <Button label="編集" variant="outlined" onClick={(e) => handleOpen(index)}></Button>
                        </Typography> */}
                            </Typography>
                          </Item>
                        ) : (
                          <></>
                        );
                      })}
                    </>
                  );
                })
              ) : (
                <></>
              )}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <IconButton onClick={(e) => handleOpen(-1)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Stack>
              <Modal isOpen={synonymModalOpen} setIsOpen={setSynonymModalOpen}>
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h4" component="h4">
                    {'類義語グループ追加'}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    類義語グループ名：
                    <TextField
                      variant="outlined"
                      defaultValue={addSynonymGroupData.synonymGroupName}
                      onChange={(e) => {
                        setAddSynonymGroupData({
                          ...addSynonymGroupData,
                          synonymGroupName: e.target.value
                        });
                      }}
                    />
                  </Typography>
                  <Button
                    label={'類義語グループ追加'}
                    attr={'button-array'}
                    variant="contained"
                    color="primary"
                    onClick={async (e) => {
                      setSynonymModalOpen(false);
                      const result = await addSynonymGroupAPI({
                        addSynonymGroupData
                      });
                      setMessage && setMessage(result.message);
                      // TODO 成功時の判定法
                      // 更新確認後、単語の意味を再取得させる
                      // TODO この再取得の部分は共通関数化できないかな
                      if (result.message.messageColor === 'success.light') {
                        const newWordDetail = (await getWordDetailAPI({ id: String(wordDetail.id) }))
                          .result as GetWordDetailAPIResponseDto;
                        setWordDetail && setWordDetail(newWordDetail);
                      }
                      setAddSynonymGroupData({
                        ...addSynonymGroupData,
                        synonymGroupName: ''
                      });
                    }}
                  />
                </Box>
              </Modal>
            </Stack>
          )}
        </Box>
      </Card>
    </>
  );
};