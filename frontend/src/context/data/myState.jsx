import React, { useEffect, useState } from 'react'
import MyContext from './myContext'
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../fireabase/FirebaseConfig';
import { useNewProductMutation } from '../../redux/api/productApi';
import { useSelector } from 'react-redux';
function myState(props) {
    const [mode, setMode] = useState('light');
    const [newProduct] = useNewProductMutation();
    const { user } = useSelector(
        (state) =>
            state.userReducer
    );
    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = "rgb(17, 24, 39)"
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = "white"
        }
    }

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState({
        name: null,
        price: null,
        category: null,
        description: null,
        stock: null,
        id:''
    });

    const addProduct = async () => {
        if (products.name == null || products.price == null || products.category == null || products.description == null || products.stock == null) {
            return toast.error("all fields are required")
        }

        // setLoading(true)

        // try {
        //     const productRef = collection(fireDB, 'products');
        //     await addDoc(productRef, products)
        //     toast.success("Add product successfully");
        //     setTimeout(() => {
        //         window.location.href = '/dashboard'
        //     }, 800);
        //     getProductData();
        //     setLoading(false)
        // } catch (error) {
        //     console.log(error);
        //     setLoading(false)
        // }
        // setProducts("");
        
        const res = await newProduct({id:user._id,products});

        console.log(res);
    }

    const [product, setProduct] = useState([]);

    const getProductData = async () => {

        setLoading(true)

        try {
            const q = query(
                collection(fireDB, 'products'),
                orderBy('time')
            );

            const data = onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                setProduct(productArray);
                setLoading(false)
            });

            return () => data;

        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    useEffect(() => {
        getProductData();
    }, []);

    // update product function

    const edithandle = (item) => {
        setProducts(item)
    }

    const updateProduct = async () => {
        setLoading(true)
        try {

            await setDoc(doc(fireDB, 'products', products.id), products)
            toast.success("Product Updated successfully")
            setTimeout(() => {
                window.location.href = '/dashboard'
            }, 800);
            getProductData();
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    // delete product

    const deleteProduct = async (item) => {
        setLoading(true)
        try {
            await deleteDoc(doc(fireDB, 'products', item.id))
            toast.success('Product Deleted successfully')
            getProductData();
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    const [order, setOrder] = useState([]);

    const getOrderData = async () => {
        setLoading(true)
        try {
            const result = await getDocs(collection(fireDB, "order"))
            const ordersArray = [];
            result.forEach((doc) => {
                ordersArray.push(doc.data());
                setLoading(false)
            });
            setOrder(ordersArray);
            console.log(ordersArray)
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }



    useEffect(() => {
        getOrderData();
    }, []);

    const [searchkey, setSearchkey] = useState('')
    const [filterType, setFilterType] = useState('')
    const [filterPrice, setFilterPrice] = useState('')

    return (
        <MyContext.Provider value={{
            mode, toggleMode, loading, setLoading,
            products, setProducts, addProduct, product,
            edithandle, updateProduct, deleteProduct, order,
            searchkey, setSearchkey, filterType, setFilterType,
            filterPrice, setFilterPrice
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default myState