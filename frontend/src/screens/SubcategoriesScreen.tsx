import React,{useState, useEffect, act} from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator,ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {subcategoriesStyles} from '../styles/SubcategoriesStyles';
import {subcategoryService, categoryService, authService} from '../services/api';

export default function SubcategoriesScreen(){
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] =  useState<any>(null);
    const [currenteUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({name:'',description: '', categoryId: '', active: true});
    
    useEffect(()=>{
        loadSubcategories();
        loadCategories();
        loadCurrentUser();
    },[]);

    const loadCurrentUser = async () => {
        try{
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        }catch(error){
            console.error('Error al cargar el usuario: ',error);
        }
    };

    const loadSubcategories = async () => {
        setLoading(true);
        try{
            const response = await subcategoryService.getAll();
            setSubcategories(response?.data||[]);
        }catch(error){
            console.error('Error alcargar las subcategorias');
            setSubcategories([]);
            Alert.alert('Error','No se pudieron cargar las subcategorias');
        }finally{
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try{
            const response = await categoryService.getAll();
            setCategories(response?.data||[]);
        }catch(error){
            console.error('Error alcargar las categorias');
            setCategories([]);
        }
    };

    const handlesave = async () => {
        if(!formData.categoryId){
            Alert.alert('Error','Debe seleccionar una categoria');
            return;
        }

        try{
            const data = {
                name: formData.name,
                description: formData.description,
                active: formData.active,
                category: {id: parseInt(formData.categoryId)}
            };

            if(editing){
                await subcategoryService.update(editing.id, data);
                Alert.alert('Exito', 'Subcategoria actualizada')
            }else{
                await subcategoryService.create(data);
                Alert.alert('Exito','Subcategoria creada');
            }
            setModalVisible(false);
            resetForm();
            loadSubcategories();
        }catch (error: any){
            Alert.alert('Error', error.response?.data?.message || 'No se pudo guardar la subcategoria');
        }
    };

    const handleDelete =(item:any) =>{
        if(currenteUser?.role !== 'ADMIN'){
            Alert.alert('Acceso denegado','Solo los administradores pueden eliminar');
            return;
        }
        
        Alert.alert('Confirmar',`¿Eliminar subcategoria ${item.name}?`,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () =>{
                    try{
                        await subcategoryService.delete(item.id);
                        Alert.alert('Exito','Subcategoria Eliminada');
                        loadSubcategories();
                    }catch(error){
                        Alert.alert('Error','No se puede eliminar');
                    }
                }
            }
        ]);
    };

    const handleToggleActive = (item : any) => {
        const action = item.active ? 'Desactivar' :
         'Activar';
        Alert.alert('Confirmar',`¿${action.charAt(0).toUpperCase() + action.slice(1)}${item.name}?`,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: action.charAt(0).toUpperCase() + action.slice(1),onPress: async () =>{
                    try{
                        await subcategoryService.update(item.id,{
                            name: item.name,
                            description: item.description,
                            active: item.active,
                            category: {id: item.category.id}
                        });
                        Alert.alert('Exito',`Subcategorias ${item.active ? 'desactivada' : 'activada'}`);
                        loadSubcategories();
                    }catch(error){
                        Alert.alert('Error',`No se pudo ${action}`);
                    }
                }
            }
        ]);
    };

    const openModal = (item : any = null) => {
        if(item){
            setEditing(item);
            setFormData({
                name: item.name, 
                description: item.description || '',
                categoryId: item.category?.id?.toString() || '',
                active: item.active
            });
        }else{
            resetForm();
        }
        setModalVisible(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({name: '', description: '', categoryId: '', active: true});
    };

    if(loading){
        return(
            <View style={subcategoriesStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff"/>
                <Text style={subcategoriesStyles.loadingText}>Cargando subcategorias...</Text>
            </View>
        );
    }

    return(
        <View style={subcategoriesStyles.container}>
            {/*header*/}
            <View style={subcategoriesStyles.header}>
                    <Text style={subcategoriesStyles.headerTitle}>Gestion de subcategorias</Text>
                    <Text style={subcategoriesStyles.headerSubtitle}>
                        Administra las subcategorias de productos
                    </Text>
                    </View>

                    {/*Actions*/}
                    <View style={subcategoriesStyles.actionsContainer}>
                    <TouchableOpacity 
                        style={subcategoriesStyles.primaryButton}
                        onPress={() => {openModal();}}
                    >
                        <Text style={subcategoriesStyles.primaryButtonText}>+ Nueva Subcategoria</Text>
                    </TouchableOpacity>
                </View>

            {/*Subcategories list*/}
            <FlatList
                data={subcategories}
                keyExtractor={(item) => item.id.toString() || Math.random().toString()}
                refreshing={loading}
                onRefresh={loadSubcategories}
                style={subcategoriesStyles.list}
                contentContainerStyle={subcategoriesStyles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                    if(!item) return null;

                    return(
                        <View style={subcategoriesStyles.card}>
                            <View style={subcategoriesStyles.cardHeader}>
                                <Text style={subcategoriesStyles.cardTitle}>
                                    {item?.name || 'Sin nombre'} {item.active && <Text style={{color: '#999'}}>(Inactiva)</Text>}
                                    </Text>
                                    <Text style={subcategoriesStyles.cardSubtitle}>{item?.description || 'Sin descripcion'}</Text>
                                    <Text style={subcategoriesStyles.cardMeta}>Categoria{item?.category?.name || 'Sin categoria'}</Text>
                            </View>
                            <View style={subcategoriesStyles.cardActions}>
                                <TouchableOpacity
                                    style={[subcategoriesStyles.actionButton, subcategoriesStyles.editButton]}
                                    onPress={() => openModal(item)}
                                >
                                    <Text style={subcategoriesStyles.actionButtonText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[subcategoriesStyles.actionButton,item.active ? subcategoriesStyles.deleteButton : subcategoriesStyles.editButton]}
                                    onPress={() => handleToggleActive(item)}
                                    >
                                    <Text style={[subcategoriesStyles.actionButtonText,item.active ? subcategoriesStyles.deleteButtonText : subcategoriesStyles.editButtonText]}>
                                        {item.active ? 'Descativar' : 'Activar'}
                                    </Text>
                                </TouchableOpacity>
                                {currenteUser?.role ==='ADMIN' &&(
                                        <TouchableOpacity
                                        style={[subcategoriesStyles.actionButton,subcategoriesStyles.deleteButton]}
                                        onPress={() => handleDelete(item)}
                                        >
                                            <Text style={[subcategoriesStyles.actionButtonText, subcategoriesStyles.deleteButtonText]}>Eliminar</Text>
                                        </TouchableOpacity>
                                    )}
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    loading ? (
                        <View style={subcategoriesStyles.emptyContainer}>
                            <Text style={subcategoriesStyles.emptyText}>No hay subcategorias</Text>
                            <Text style={subcategoriesStyles.emptySubtext}>
                                Toca "Nueva" para nueva subcategoria y comenzar
                            </Text>
                        </View>
                    ) : null
                }
            />

            {/*Modal*/}
            <Modal visible={modalVisible} animationType="slide" transparent={true} >
                <View style={subcategoriesStyles.modalOverlay}>
                    <View style={subcategoriesStyles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={subcategoriesStyles.modalHeader}>
                                <Text style={subcategoriesStyles.modalTitle}>
                                    {editing ? 'Editar Subcategoria' : 'Nueva Subcategoria'}
                                </Text>
                            </View>

                            <View style={subcategoriesStyles.formContainer}>
                                <View style={subcategoriesStyles.inputGroup}>
                                    <Text style={subcategoriesStyles.inputLabel}>Nombre *</Text>
                                    <TextInput
                                        style={subcategoriesStyles.input}
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({...formData, name: text})}
                                        placeholder="Nombre de la subcategoria"
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            
                                <View style={subcategoriesStyles.inputGroup}>
                                        <Text style={subcategoriesStyles.inputLabel}>Descripcion</Text>
                                        <TextInput
                                            style={[subcategoriesStyles.input, subcategoriesStyles.textArea]}
                                            value={formData.description}
                                            onChangeText={(text) => setFormData({...formData, description: text})}
                                            placeholder="Descripcion"
                                            placeholderTextColor="#999"
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                        />
                                </View>

                                <View style={subcategoriesStyles.inputGroup}>
                                        <Text style={subcategoriesStyles.inputLabel}>Categoria</Text>
                                        <View style={subcategoriesStyles.picker}>
                                            <Picker
                                                selectedValue={formData.categoryId}
                                                onValueChange={(value: string) =>
                                                    setFormData({...formData, categoryId: value})}>
                                            <Picker.Item label="Seleccione una categoria" value="" />
                                            {(categories || []).map((cat) => {
                                                if(!cat || !cat.id || !cat.name)
                                                    return null;
                                                return (<Picker.Item
                                                    key={cat.id}
                                                    label={cat.name}
                                                    value={cat.id.toString()}/>
                                            );
                                            })}
                                            </Picker>
                                        </View>
                                </View>
                                </View>

                            <View style={subcategoriesStyles.modalActions}>
                                <TouchableOpacity 
                                style={[subcategoriesStyles.secundaryButton]}
                                onPress={() => setModalVisible(false)}
                                >
                                    <Text style={[subcategoriesStyles.secundaryButtonText]}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[subcategoriesStyles.primaryButton]}
                                    onPress={handlesave}
                                >
                                    <Text style={[subcategoriesStyles.primaryButtonText]}>
                                        {editing ? 'Actualizar' : 'Guardar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}