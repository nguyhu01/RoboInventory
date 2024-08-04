

'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, Stack, TextField, Button, Card, CardContent, Container, Grid, AppBar, Toolbar, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { firestore } from '../firebase';
import { getDocs, query, collection, doc, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import ImageCapture from './ImageCapture';
import { Logout } from '@mui/icons-material';
import Auth from './Auth';

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage: 'url("/pantry_bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  flexDirection: 'column',
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  transition: 'none',

}));

const ItemCard = styled(Card)(({ theme }) => ({
  // transition: 'none',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[3],
  },
}));

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      updateInventory();
    }
  }, [user]);

  const updateInventory = async () => {
    if (!auth.currentUser) return;

    const userInventoryRef = collection(firestore, 'users', auth.currentUser.uid, 'inventory');
    const snapshot = await getDocs(userInventoryRef);
    const inventoryList = [];

    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    if (!auth.currentUser) return;

    const itemRef = doc(firestore, 'users', auth.currentUser.uid, 'inventory', item);
    const docSnap = await getDoc(itemRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity === 1) {
        await deleteDoc(itemRef);
      } else {
        await updateDoc(itemRef, {
          quantity: quantity - 1
        });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    if (!auth.currentUser) return;

    const itemRef = doc(firestore, 'users', auth.currentUser.uid, 'inventory', item);
    const docSnap = await getDoc(itemRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(itemRef, {
        quantity: quantity + 1
      });
    } else {
      await setDoc(itemRef, {
        quantity: 1
      });
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClassification = (classifiedItemName) => {
    setItemName(classifiedItemName);
    handleOpen();
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Error signing out:', error));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  return (
    <StyledBox>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'grey' }}>
            RoboInventory
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box py={4}>
          <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            MY PANTRY
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item>
            <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'black',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0.1, 0.1)', 
              },
            }}
          >
            Add Item Manually
          </Button>
            </Grid>
            <Grid item>
              <ImageCapture onClassification={handleClassification} />
            </Grid>
          </Grid>

          <GlassCard>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Inventory Items
              </Typography>
              <Grid container spacing={3}>
                {inventory.map(({ name, quantity }) => (
                  <Grid item xs={12} sm={6} md={4} key={name}>
                    <ItemCard variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Quantity: {quantity}
                        </Typography>
                        <Box mt={2}>
                          <Button variant="outlined" onClick={() => addItem(name)} sx={{ mr: 1 }}>
                            Add
                          </Button>
                          <Button variant="outlined" color="secondary" onClick={() => removeItem(name)}>
                            Remove
                          </Button>
                        </Box>
                      </CardContent>
                    </ItemCard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </GlassCard>
        </Box>
      </Container>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" gutterBottom>Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
            />
            <Button
              variant="contained"
              onClick={() => {
                if (itemName.trim()) {
                  addItem(itemName.trim());
                  setItemName('');
                  handleClose();
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </StyledBox>
  );
}

