import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import EnvironmentButton from '../components/EnvironmentButton'
import Header from '../components/Header'
import Load from '../components/Load'
import PlantCardPrimary from '../components/PlantCardPrimary'
import api from '../services/api'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface EnvironmentProps {
    key: string;
    title: string;
}

interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        time: number;
        repeat_every: string;
    }
}

export default function PlantSelect() {
    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);


    const fetchPlants = async () => {
        const { data } = await api
        .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`)

        if (!data) {
            return setLoading(true);
        }

        if (page > 1) {
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        } else {
            setPlants(data);
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    const handleEnvironmentSelected = (environmentKey: string) => {
        setEnvironmentSelected(environmentKey)

        if (environmentKey === 'all') {
            return setFilteredPlants(plants)
        }

        return setFilteredPlants(plants.filter(plant => plant.environments.includes(environmentKey)))
    }

    const handleFetchMore = async (distance: number) => {
        if (distance < 1) {
            return;
        }

        setLoadingMore(true)
        setPage(oldValue => oldValue + 1);
        await fetchPlants();
    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api.get('plants_environments?_sort=title&_order=asc')
            setEnvironments([{
                key: 'all',
                title: 'Todos',
            },
            ...data
            ])
        }

        fetchEnvironment()
    }, [])

    useEffect(() => {
        fetchPlants()
    }, [])

    if (loading) {
        return <Load />
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
            </View>

            <View>
                <FlatList
                    data={environments}
                    horizontal
                    renderItem={({item}) => (
                        <EnvironmentButton
                            key={item.key}
                            title={item.title}
                            active={item.key === environmentSelected}
                            onPress={() => handleEnvironmentSelected(item.key)}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    renderItem={({item}) => (
                        <PlantCardPrimary key={item.id} data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={
                        loadingMore ?
                        <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginVertical: 32,
        paddingHorizontal: 35,
    },
    plants: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    }
})
