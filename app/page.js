'use client'

import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '../firebase'
import {Box, Typography, Modal, Stack, TextField, Button} from '@mui/material'
import { getDocs, query, collection, doc, deleteDoc } from 'firebase/firestore';

import { getDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';

// import styles from "./page.module.css";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")

  const updateInventory = async () => {
    // const snapshot = await firestore.collection('inventory').get() // Created by Vscode
    // const data = snapshot.docs.map(doc => doc.data())
    // setInventory(data)
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await updateDoc(docRef, {
          quantity: quantity - 1
        })
      }
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

        await updateDoc(docRef, {
          quantity: quantity + 1
        })
      } else {
        await setDoc(docRef, {
          quantity: 1
        })
      }
      await updateInventory()
    }
    
  

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box width="100vw " height="100vh" display='flex' flexDirection="column" justifyContent='center' alignItems='center' gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position='absolute' top='50%' left='50%' sx={{transform:'translate(-50%, -50%)'}} width={400} bgcolor='white' border='2px solid #000' boxShadow={24} p={4} display='flex' flexDirection='column' gap={3}> 
        <Typography variant='h6'>Add Item</Typography>
        <Stack width='100%' direction='row' spacing={2}>
          <TextField variant='outlined' fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
          <Button variant='outlined' onClick={() => {
            addItem(itemName) 
            setItemName('') 
            handleClose()
            }}>Add</Button> 
        </Stack>
        </Box>
      </Modal>
      
      {/* <Typography variant='h1'>Inventory Management</Typography> */}
      {/* {
        inventory.map((item) => {
          return (
            <Box key={item.name}>
              <Typography variant='h2'>{item.name}</Typography>
              <Typography variant='h3'>{item.quantity}</Typography>
            </Box>
          )
        })
      } */}

      {/* <Button variant='contained' onClick={handleOpen}>Add Item</Button> */}
      <Button variant='contained' onClick={() => {
        handleOpen()
      }}>Add Item</Button>

      <Box border='1px solid #333'>
        <Box width='800px' height='100px' bgcolor="#ADD8E6" display='flex' alignItems='center' justifyContent='center'>
          <Typography variant='h2' color='#333'>Inventory Items</Typography>
        </Box>
      </Box>

      <Stack width='800px' heigh='300px' spacing={2} overflow='auto'>
        {inventory.map(({name, quantity}) => (
          <Box key={name} width='100%' minHeight='150px' display='flex' alignItems='center' justifyContent='space-between' bgcolor='#f0f0f0' padding={5}>
            <Typography variant='h3' color ='#333' textAlign='center'>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Typography variant='h3' color ='#333' textAlign='center'>
              {quantity}
            </Typography>

            <Stack direction='row' spacing={2}></Stack>
            
            <Button variant='contained' onClick={() => addItem(name)}>Add</Button>
            <Button variant='contained' onClick={() => removeItem(name)}>Remove</Button>
          </Box>
        
        ))}
      </Stack>

    </Box>
  );
}
