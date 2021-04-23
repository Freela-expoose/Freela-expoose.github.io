import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { MdDelete, MdAdd, MdUpdate, MdCached } from "react-icons/md";
import CircularProgress from '@material-ui/core/CircularProgress';
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableContainer from "@material-ui/core/TableContainer";
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import TableRow from "@material-ui/core/TableRow";
import Backdrop from "@material-ui/core/Backdrop";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";

import "./styles.css";
import api from "../../../../services/api";


interface Data {
  _id: string;
  title: string;
  description: string;
  price: number;
  expireDate: string;
  isActive: boolean;
  photo: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

// type ModalType = "delete" | "update";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<Data>(array: Data[], comparator: (a: any, b: any) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [Data, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}


const headCells: HeadCell[] = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Título' },
  { id: '_id', numeric: true, disablePadding: false, label: 'ID' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Preço' },
  { id: 'expireDate', numeric: true, disablePadding: false, label: 'Data de vencimento' },
  { id: 'isActive', numeric: true, disablePadding: false, label: 'Estado' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  refresh(): void;
  setIsLoading(load: boolean): void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort, refresh, setIsLoading } = props;
  const [formData, setFormData] = React.useState<Data>({
    _id: "",
    title: "",
    description: "",
    price: 0,
    expireDate: "",
    isActive: true,
    photo: ""
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const token = localStorage.getItem("@Expose:token");
  const [price, setPrice] = React.useState<Number>(0);
  const wrapper = React.createRef();

  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  function handleModalAddCoupon() {
    // alert('Adicionar!!!' + rowData.name);
    setOpenModal(true);
  }

  const handleChangeFormData = (event: React.ChangeEvent<{name?: string | undefined, value: unknown}>) => {
    const { name, value } = event.target;
    // console.log(value);
    // 0 = default value for variables of type Number
    // Thats why i change 0(desativado) for 2(desativado)
    // And then he obay the conditional and change the state correctly

    if(name && value){
      if(name === "isActive"){
        setFormData({
          ...formData,
          [name]: value === 1 ? true : false,
        });
      }else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
    // console.log("formData add", formData);
  };

  function handleSubmitAddFormData() {
      setOpenModal(false);
      setIsLoading(true);
      const {title, description, photo, isActive, expireDate} = formData;
      // console.log(price);
      const newData = {
        title, 
        description, 
        photo, 
        isActive, 
        expireDate,
        price: price
      };
      // console.log(price);
    api.post('coupon/create', newData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => {
        alert("Adicionado com sucesso!!! ");
        refresh();
    }).catch(err => alert(err.message)).finally(() => setIsLoading(false));
  }

  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value } = event.target;

    // price= Number(value);
    setPrice(Number(value));
    // console.log(price);
  };

  return (
    <>
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell align="right">
            {/* <button
              className="custom-button blue"
              onClick={() => handleModalAddCoupon()}
            >
              <MdAdd />
            </button> */}
            <Button
              startIcon={<MdAdd />}
              color="primary"
              variant="contained"
              onClick={() => handleModalAddCoupon()}
            >
              Adicionar cupom
            </Button>
          </TableCell>
        </TableRow>
      </TableHead>

      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        ref={wrapper}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <section className={classes.container} id="modal">
            <h2>Adicionar cupom</h2>
            <form noValidate autoComplete="off">
              {/* <Grid container justify="center"> */}
              <section id="modal-form">
                <section id="div-form">
                
                  <section style={{display: 'flex'}}>
                    <TextField
                      id="title"
                      onChange={handleChangeFormData}
                      name="title"
                      variant="filled"
                      label="Título"
                      className={classes.margin}
                      required
                      color="secondary"
                    />

            
  
                    <section id="select-div">
                      <InputLabel id="select-label">Estado</InputLabel>
                      <Select
                        labelId = "select-label"
                        id="isActive"
                        value={formData.isActive ? 1 : 2}
                        onChange={handleChangeFormData}
                        name="isActive"
                        className={classes.margin}
                        color="secondary"
                        fullWidth
                        style={{width: '100%'}}
                      >
                        <MenuItem value={1} >Ativado</MenuItem>
                        <MenuItem value={2} >Desativado</MenuItem>
                      </Select>
                    </section>
                  </section>

                  <section>
                    {/* <TextField
                      id="expireDate"
                      onChange={handleChangeFormData}
                      name="expireDate"
                      label="Data de vencimento"
                      type="date"
                      className={classes.margin}
                      required
                      color="secondary"
                      InputLabelProps={{
                        shrink: true,
                      }}             
                      fullWidth
                    /> */}

                    <TextField
                      id="price"
                      onChange={handleChangeTextField}
                      name="price"
                      variant="filled"
                      label="Preço"
                      className={classes.margin}
                      defaultValue={price}
                      required
                      type="number"
                      color="secondary"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </section>

                  <TextField
                    id="description"
                    onChange={handleChangeFormData}
                    name="description"
                    variant="filled"
                    label="Descrição"
                    className={classes.margin}
                    required
                    color="secondary"
                    fullWidth
                    multiline
                  />
                
                </section>

              </section>
              <Button
                variant="contained"
                onClick={handleSubmitAddFormData}
                color="primary"
                style={{marginTop: 24}}
              >
                Enviar
              </Button>
              
            </form>
          </section>
        </Fade>
      </Modal>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.type === "light" ? "#424242" : "white",
    },
    paper: {
      maxWidth: "70%",
      margin: "auto",
      marginBottom: theme.spacing(2),
      marginTop: 80,
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },

    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0,
      border: 0,
    },

    container: {
      backgroundColor: theme.palette.background.paper,
      border: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        // width: '25ch',
      },
      borderRadius: 8,
    },

    button: {
      marginRight: 24,
    },

    margin: {
      // display: 'inline-flex'
      // flex: 1
    },

    marginSearch: {
      margin: 8
    },

    loading: {
      marginLeft: 12,
      marginTop: 16
    },

    refreshButton: {
      margin: 8,
      float: 'right'
    }
  })
);

const CouponTable: React.FC = () => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("title");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openDelModal, setOpenDelModal] = React.useState<boolean>(false);
  const [currentRow, setCurrentRow] = React.useState<Data>({} as Data);
  const [rows, setRow] = React.useState<Data[]>([] as Data[]);
  const [formData, setFormData] = React.useState<Data>({
    _id: "",
    title: "",
    description: "",
    price: 0,
    expireDate: "",
    isActive: true,
    photo: ""
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [price, setPrice] = React.useState<Number>(0);
  const history = useHistory();
  const currentUser = JSON.parse(String(localStorage.getItem("@Expose:user")));
  const token = localStorage.getItem("@Expose:token");
  const rootRef = React.useRef<HTMLDivElement>(null);


  // TODO: Carregar todos os dados da lista
  useEffect(() => {
    if(currentUser && token){
      setIsLoading(true);
      api.get<Data[]>('coupon/get').then(res => {
        setRow(res.data);
      }).catch(err => {
        if (err.response) {
            // Request made and server responded
            window.alert(err.response.data.message);
        } else if (err.request) {
            // The request was made but no response was received
            console.log(err.request);
            window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
        } else {
            // Something happened in setting up the request that triggered an err
            console.log('Error', err.message);
            window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
        }
      }).finally(() => setIsLoading(false));
    }else {
      history.push("/");
    }
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeTextField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    
    setPrice(Number(value));  
  };


  const handleChangeFormData = (event: React.ChangeEvent<{name?: string | undefined, value: unknown}>) => {
    const { name, value } = event.target;
    // event.preventDefault();
    // 0 = default value for variables of type Number
    // Thats why i change 0(desativado) for 2(desativado)
    // And then he obay the conditional and change the state correctly

    // Re-render problem: putting the Pure Modal in the Father body component resolve it
    // The setState() has a delay to change itself

    if(name && value){
      if(name === "isActive"){
        // console.log("IsActive:", value === 1 ? true : false)
        // ... => spread operator
        setFormData({
          ...formData,
          [name]: value === 1 ? true : false,
        });
      }else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
    // console.log("Valor: ", value);
    // console.log("Condição: ", name === "isActive");
    // console.log("Pós formData", formData);
  };

  // TODO: Modal confirmando o Delete
  function handleModalDelete(rowData: Data) {
    setCurrentRow(rowData);
    // setModalType("delete");
    setOpenDelModal(true);
  }

  function handleModalUpdate(rowData: Data) {
    // setCurrentRow(rowData);
    setFormData(rowData);
    // setModalType("update");
    setOpenModal(true);
  }

  function refreshTable() {
    setIsLoading(true);
    api.get<Data[]>('coupon/get').then(res => {
      setRow(res.data);
    }).catch(err => {
      if (err.response) {
          // Request made and server responded
          window.alert(err.response.data.message);
      } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
          window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
      } else {
          // Something happened in setting up the request that triggered an err
          console.log('Error', err.message);
          window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
      }
    }).finally(() => setIsLoading(false));
  }

  function handleDelete() {
    setOpenDelModal(false);
    setIsLoading(true);
    api.delete('coupon/delete', {
      params: {
        _id: currentRow._id
      },
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((res) => {
      alert('Deletado com sucesso!!!');
      // refreshPage();
      refreshTable();
    } ).catch(err => {
      if (err.response) {
          // Request made and server responded
          window.alert(err.response.data.message);
      } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
          window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
      } else {
          // Something happened in setting up the request that triggered an err
          console.log('Error', err.message);
          window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
      }
    }).finally(() => setIsLoading(false));
  }

  function handleSubmitUpFormData() {
    setOpenModal(false);
    setIsLoading(true);
    const {title, description, isActive, _id} = formData;
    // console.log(price);
    const newData = {
      _id,
      title, 
      description,
      isActive,
      price
    };
    console.log("Data: ",newData);
    api.patch('coupon/update', newData, {
      params: {
        type: currentUser.type
      },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(res => {
        alert("Atualizado com sucesso!!!");
        // refreshPage();
        refreshTable();
    }).catch(err => {
      if (err.response) {
          // Request made and server responded
          window.alert(err.response.data.message);
      } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
          window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
      } else {
          // Something happened in setting up the request that triggered an err
          console.log('Error', err.message);
          window.alert("Parece que houve um problema nos nossos servidores. Por favor aguarde um pouco e tente novamente.");
      }
    }).finally(() => setIsLoading(false));
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root} ref={rootRef}>
      <h1 id="titlePage">Tabela de cupons</h1>

      <Paper className={classes.paper}>
        {isLoading && <CircularProgress className={classes.loading} color="secondary" />}
        <IconButton className={classes.refreshButton} onClick={refreshTable}>
          <MdCached />
        </IconButton>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              refresh={refreshTable}
              setIsLoading={(load: boolean) => setIsLoading(load)}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row._id}>
                      <TableCell component="th" scope="row">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">{row._id.substring(0, 12)+ "..."}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="right">{String(row.expireDate).substring(8, 10) + "/" +  String(row.expireDate).substring(5, 7) + "/" +  String(row.expireDate).substring(0, 4)}</TableCell>
                      <TableCell align="right">{row.isActive ? "Ativo" : "Desativado"}</TableCell>
                      <TableCell align="right">
                        <button
                          className="custom-button yellow"
                          onClick={() => handleModalUpdate(row)}
                        >
                          <MdUpdate />
                        </button>
                        <button
                          className="custom-button red"
                          onClick={() => handleModalDelete(row)}
                        >
                          <MdDelete />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          container={() => rootRef.current}
        >
          <Fade in={openModal}>
            <div className={classes.container} id="modal">
              {/* Alterando o state(formData) ele renderiza o componente novamente */}
              <h2>Atualizar cupom: {formData.title}</h2>
              <form noValidate autoComplete="off">
                {/* <Grid container justify="center"> */}
                <div id="modal-form">
                  <div id="div-form">
                  
                    <div style={{display: 'flex'}}>
                      <TextField
                        id="title"
                        onChange={handleChangeFormData}
                        name="title"
                        variant="filled"
                        label="Título"
                        className={classes.margin}
                        defaultValue={formData.title}
                        // value={formData.title}
                        required
                        color="secondary"
                      />
    
                      <div id="select-div">
                        <InputLabel id="select-label">Estado</InputLabel>
                        <Select
                          labelId = "select-label"
                          id="isActive"
                          value={formData.isActive ? 1 : 2}
                          onChange={handleChangeFormData}
                          name="isActive"
                          className={classes.margin}
                          color="secondary"
                          fullWidth
                          style={{width: '100%'}}
                        >
                          <MenuItem value={1} >Ativado</MenuItem>
                          <MenuItem value={2} >Desativado</MenuItem>
                        </Select>
                      </div>
                    </div>

                    <div>
                      {/* <TextField
                        id="expireDate"
                        onChange={handleChangeFormData}
                        name="expireDate"
                        label="Data de vencimento"
                        type="date"
                        className={classes.margin}
                        required
                        color="secondary"
                        // defaultValue="24-05-2017"
                        // value={formData.expireDate}
                        InputLabelProps={{
                          shrink: true,
                        }}             
                      /> */}

                      <TextField
                        id="price"
                        onChange={handleChangeTextField}
                        name="price"
                        variant="filled"
                        label="Preço"
                        className={classes.margin}
                        defaultValue={formData.price}
                        // value={price}
                        required
                        type="number"
                        color="secondary"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </div>

                    <TextField
                      id="description"
                      onChange={handleChangeFormData}
                      name="description"
                      variant="filled"
                      label="Descrição"
                      className={classes.margin}
                      defaultValue={formData.description}
                      // value={formData.description}
                      required
                      color="secondary"
                      fullWidth
                      multiline
                    />
                  
                  </div>

                  <div id="modal-upload-images">
                    <img
                      src={formData.photo}
                      alt="Foto"
                      width="256"
                    />
                    {/* <div>
                      <Button variant="contained" component="label" fullWidth>
                        Carregar imagem
                        <input
                          id="photo"
                          type="file"
                          hidden
                          onChange={handleChangeFormData}
                          name="photo"
                        />
                      </Button>
                    </div> */}
                  </div>
                {/* </Grid> */}
                </div>
                <Button
                  variant="contained"
                  onClick={handleSubmitUpFormData}
                  color="primary"
                  style={{marginTop: 24}}
                >
                  Enviar
                </Button>
                
              </form>
            </div>
          </Fade>
        </Modal>

      <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openDelModal}
          onClose={() => setOpenDelModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          container={() => rootRef.current}
        >
          <Fade in={openDelModal}>
            <div className={classes.container}>
              <h2 id="transition-modal-title">Deseja continuar</h2>
              <p id="transition-modal-description">
                Quer mesmo deletar {currentRow.title}?
              </p>

              <div id="button-group">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleDelete}
                  type="submit"
                >
                  Sim
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDelModal(false)}
                >
                  Não
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
    </div>
  );
};

export default CouponTable;