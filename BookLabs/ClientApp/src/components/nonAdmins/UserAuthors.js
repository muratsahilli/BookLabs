import axios from '../../api/axios';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap'; import DataTable from 'react-data-table-component';
import UserNavigation from './UserNavigation';
export default function UserAuthors() {

    const [authors, setAuthors] = useState([]);
    useEffect(() => {
        (async () => await Load())();
    }, []);
    async function Load() {
        const result = await axios.get("/Authors");
        setAuthors(result.data);
    }

    const columns = [
        {
            name: 'Id',
            selector: (row) => row.authorId,
            sortable: true,
        },
        {
            name: 'Author Name',
            selector: (row) => row.authorName,
            sortable: true,
        },
        {
            name: 'Birth Date',
            selector: (row) => row.birthDate.split("T")[0],
            sortable: true,
        },
        {
            name: 'Books',
            selector: (row) => row.books.map(book => book.title).join(', '),
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
            <h3>Author List</h3>
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
                    data={authors}
                    keyField="authorId"
                    pagination={true}
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[5, 10, 20, 50]}
                    customStyles={customStyles}
                />
            </Container>
        </div>
    )

}