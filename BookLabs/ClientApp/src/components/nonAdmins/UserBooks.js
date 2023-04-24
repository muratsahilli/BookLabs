import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from '../../api/axios';
import UserNavigation from './UserNavigation';

const UserBooks = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    (async () => await Load())();
  }, []);
  async function Load() {
    const result = await axios.get("/Books");
    setBooks(result.data);
  }
  const columns = [
    {
      name: 'Id',
      selector: (row) => row.bookId,
      sortable: true,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Page',
      selector: (row) => row.totalPages,
      sortable: true,
    },
    {
      name: 'Published Date',
      selector: (row) => row.publishedDate.split("T")[0],
      sortable: true,
    },
    {
      name: 'Authors',
      selector: (row) => row.authors.map(a => a.authorName).join(', '),
      sortable: true,
    },
  ];

  // Define the DataTable styles
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: `rgb(${119}, ${160}, ${169})`,
        color: '#fff',
        fontWeight: 'bold',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: `rgb(${111}, ${125}, ${140})`,
        color: '#fff',
        cursor: 'pointer',
      },
    },
    pagination: {
      style: {
        backgroundColor: `rgb(${119}, ${160}, ${169})`,
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };
  const customHeader = (
    <div className="d-flex justify-content-between">
      <h3>Book List</h3>
    </div>
  );
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px'}}>
      <UserNavigation />
      <Container>

        <br></br><br></br>
        <DataTable
          title={customHeader}
          columns={columns}
          data={books}
          keyField="bookId"
          pagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          customStyles={customStyles}
        />

      </Container>
    </div>
  )
}
export default UserBooks