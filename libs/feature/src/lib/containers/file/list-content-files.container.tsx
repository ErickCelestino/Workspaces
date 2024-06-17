import {
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import { ContentFile } from '@workspaces/domain';
import { ListContentFilesRequest, getItemLocalStorage } from '../../services';
import { useLoggedUser } from '../../contexts';
import { ListContentFiles } from '../../components';

export const ListContanteFilesContainer = () => {
  const [fileList, setFileList] = useState<ContentFile[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [directoryId, setDirectoryId] = useState('');

  const theme = useTheme();
  const { loggedUser } = useLoggedUser();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const directoryId = getItemLocalStorage('di');
    setDirectoryId(directoryId);
    const getData = async () => {
      const result = await ListContentFilesRequest({
        userInput: '',
        loggedUserId: loggedUser?.id ?? '',
        directoryId: directoryId,
      });
      setFileList(result.files);
      setTotalPage(result.totalPages);
    };
    getData();
  }, []);

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListContentFilesRequest({
      userInput: '',
      directoryId: directoryId,
      loggedUserId: loggedUser?.id ?? '',
      skip: (value - 1) * 4,
    });
    setFileList(result.files);
  };

  return (
    <LayoutBase title="Listagem de Usuários">
      <Box display="flex" justifyContent="center">
        <Box width="60%">
          <Box width="95%">
            <Box>
              {fileList.length > 0 ? (
                fileList.map((file) => (
                  <ListContentFiles
                    fileImage={`http://localhost:3000/${file.fileName}`}
                    fileImageName={file.fileName}
                    name={file.originalName}
                    key={file.id}
                  />
                ))
              ) : (
                <Box
                  marginTop={theme.spacing(2)}
                  width="100%"
                  display="flex"
                  justifyContent="center"
                >
                  <Typography variant="h4">
                    Não foram encontrados registros
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box marginTop={theme.spacing(2)} display="flex" justifyContent="end">
            <Pagination
              count={totalPage}
              color="primary"
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Box>
    </LayoutBase>
  );
};
