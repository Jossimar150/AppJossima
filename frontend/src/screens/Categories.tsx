import React,{useState, useEffect, act} from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator,ScrollView } from "react-native";
import {categoriesStyles} from '../styles/CategoriesStyles';
import {categoryService, authService} from '../services/api';

export default function CategoriesScreen(){
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] =  useState<any>(null);
    const [formData, setFormData] = useState({name:'',description: ''});
    const [error, setError] = useState('');
    const [currenteUser, setCurrentUser] = useState<any>(null);
    
    useEffect(()=>{
        loadCurrentUser();
        loadCategories();
    },[]);

    const loadCurrentUser = async () => {
        try{
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        }catch(error){
            console.error('Error al cargar el usuario: ',error);
        }
    };

    const loadCategories = async () => {
        setLoading(true);
        setError('');
        try{
            const response = await categoryService.getAll();
            setCategories(response?.data||[]);
        }catch(error){
            setError('No se pudieron cargar las categorias');
            setCategories([]);
        }finally{
            setLoading(false);
        }
    };

    const handlesave = async () => {
        if(!formData.name.trim()){
            Alert.alert('Error','El nombre del rol es obligatorio');
            return;
        }

        try{
            if(editing){
                await categoryService.update(editing.id, formData);
                Alert.alert('Exito', 'Categoria actualizada')
            }else{
                await categoryService.create(formData);
                Alert.alert('Exito','Categoria creada');
            }
            setModalVisible(false);
            resetForm();
            loadCategories();
        }catch (error){
            Alert.alert('Error','No se pudo guardar');
        }
    };

    const handleDelete =(item:any) =>{
        if(currenteUser?.role !== 'ADMIN'){
            Alert.alert('Acceso denegado','Solo los administradores pueden eliminar categorias');
            return;
        }
        
        Alert.alert('Confirmar',`¿Eliminar ${item.name}?`,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () =>{
                    try{
                        await categoryService.delete(item.id);
                        Alert.alert('Exito','Categoria Eliminada');
                        loadCategories();
                    }catch(error){
                        Alert.alert('Error','No se puede eliminar');
                    }
                }
            }
        ]);
    };

    const handleToggleActive = (item : any) => {
        const action = item.active ? 'Desactivar' : 'Activar';
        Alert.alert('Confirmar',`¿${action.charAt(0).toUpperCase() + action.slice(1)}${item.name}?`,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: action.charAt(0).toUpperCase() + action.slice(1),onPress: async () =>{
                    try{
                        await categoryService.update(item.id,{
                            name: item.name,
                            description: item.description,
                            active: item.active
                        });
                        Alert.alert('Exito',`Categorias ${item.active ? 'desactivada' : 'activada'}`);
                        loadCategories();
                    }catch(error){
                        Alert.alert('Error',`No se pudo ${action}`);
                    }
                }
            }
        ]);
    };

    const handleEdit = (item : any) => {
        setFormData({name: item.name, description: item.description || ''});
        setEditing(item);
        setModalVisible(true);
    };

    const resetForm = () => {
        setFormData({name: '', description: ''});
        setEditing(null);
    };

    const renderCategory = ({item}: {item:any}) => (
        <View style={categoriesStyles.categoryCard}>
            <View style={categoriesStyles.categoryInfo}>
                <Text style={categoriesStyles.categoryName}>
                    {item.name} {!item.active && <Text style={{color: '#999'}}> (Inactiva)
                        </Text>}
                </Text>
                {item.description && (
                    <Text style={categoriesStyles.categoryDescription}>{item.description}</Text>
                )}
            </View>
            <View style={categoriesStyles.actionsConatiner}>
                <TouchableOpacity 
                    style={[categoriesStyles.actionButton, categoriesStyles.editButton]}
                    onPress={() => handleEdit(item)}
                    >
                    <Text style={[categoriesStyles.actionButtonText, categoriesStyles.editButtonText]}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[categoriesStyles.actionButton,item.active ? categoriesStyles.deleteButton : categoriesStyles.editButton]}
                    onPress={() => handleToggleActive(item)}
                    >
                    <Text style={[categoriesStyles.actionButtonText,item.active ? categoriesStyles.deleteButtonText : categoriesStyles.editButtonText]}>
                        {item.active ? 'Descativar' : 'Activar'}
                    </Text>
                </TouchableOpacity>
                {currenteUser?.role ==='ADMIN' &&(
                        <TouchableOpacity
                        style={[categoriesStyles.actionButton,categoriesStyles.deleteButton]}
                        onPress={() => handleDelete(item)}
                        >
                            <Text style={[categoriesStyles.actionButtonText, categoriesStyles.deleteButtonText]}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
            </View>
        </View>
    );

    if(loading){
        return(
            <View style={categoriesStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff"/>
                <Text style={categoriesStyles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return(
        <View style={categoriesStyles.container}>
            <View style={categoriesStyles.header}>
                <View style={categoriesStyles.headerContent}>
                    <Text style={categoriesStyles.headerTitle}>Gestion de categorias</Text>
                    <TouchableOpacity 
                        style={categoriesStyles.addButton}
                        onPress={() => {
                            resetForm();
                            setModalVisible(true);
                        }}
                    >
                        <Text style={categoriesStyles.addButtonText}>+ Nueva</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error ? (
                <View style={categoriesStyles.errorContainer}>
                    <Text style={categoriesStyles.errorText}>{error}</Text>
                    <TouchableOpacity style={categoriesStyles.retryButton} onPress={loadCategories}>
                        <Text style={categoriesStyles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id.toString() || ''}
                contentContainerStyle={categoriesStyles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    loading && !error ? (
                        <View style={categoriesStyles.emptyContainer}>
                            <Text style={categoriesStyles.emptyText}>No hay categorias</Text>
                            <Text style={categoriesStyles.emptySubtext}>Toca "Nueva" para comenzar</Text>
                        </View>
                    ) : null
                }
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={categoriesStyles.modalOverlay}>
                    <View style={categoriesStyles.modalContainer}>
                    </View>
                </View>
            </Modal>
        </View>
    )
}