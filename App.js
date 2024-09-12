import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  {
    question: "Quel est le rôle principal de l'épiderme dans la peau ?",
    options: [
      { text: "Protection contre les agressions extérieures", type: "grasse" },
      { text: "Régulation de la température", type: "seche" },
      { text: "Sécrétion de sueur", type: "mixte" },
      { text: "Absorption des nutriments", type: "noire" }
    ]
  },
  {
    question: "Quel type de peau est généralement caractérisé par des pores dilatés et une brillance excessive ?",
    options: [
      { text: "Peau sèche", type: "seche" },
      { text: "Peau grasse", type: "grasse" },
      { text: "Peau normale", type: "mixte" },
      { text: "Peau mixte", type: "mixte" }
    ]
  },
  {
    question: "Quelle est la fonction principale d'une crème hydratante ?",
    options: [
      { text: "Exfolier la peau", type: "grasse" },
      { text: "Hydrater et nourrir la peau", type: "seche" },
      { text: "Protéger la peau des UV", type: "mixte" },
      { text: "Réduire les rides", type: "noire" }
    ]
  },
  {
    question: "Quelle est la meilleure fréquence pour exfolier la peau en général ?",
    options: [
      { text: "Tous les jours", type: "grasse" },
      { text: "Une fois par mois", type: "seche" },
      { text: "2 à 3 fois par semaine", type: "mixte" },
      { text: "Jamais", type: "noire" }
    ]
  },
  {
    question: "Quel ingrédient est souvent utilisé dans les crèmes solaires pour protéger la peau contre les rayons UV ?",
    options: [
      { text: "Acide hyaluronique", type: "seche" },
      { text: "Oxyde de zinc", type: "grasse" },
      { text: "Vitamine C", type: "noire" },
      { text: "Charbon actif", type: "mixte" }
    ]
  },
  {
    question: "Quel est le principal avantage de l'utilisation d'un sérum avant d'appliquer une crème hydratante ?",
    options: [
      { text: "Réduit les rougeurs", type: "grasse" },
      { text: "Pénètre plus profondément dans la peau pour un soin ciblé", type: "seche" },
      { text: "Ajoute une couche de protection contre les polluants", type: "mixte" },
      { text: "Absorbe l'excès d'huile", type: "noire" }
    ]
  },
  {
    question: "Quelle est la principale différence entre une crème de jour et une crème de nuit ?",
    options: [
      { text: "La crème de jour est plus épaisse", type: "seche" },
      { text: "La crème de nuit contient généralement plus d'ingrédients réparateurs", type: "mixte" },
      { text: "La crème de jour est plus parfumée", type: "grasse" },
      { text: "La crème de nuit est destinée à l'exfoliation", type: "noire" }
    ]
  },
  {
    question: "Quel est l'effet de l'acide hyaluronique sur la peau ?",
    options: [
      { text: "Hydratation intense", type: "seche" },
      { text: "Réduction des taches de vieillesse", type: "noire" },
      { text: "Protection solaire", type: "mixte" },
      { text: "Stimulation de la production de collagène", type: "grasse" }
    ]
  },
  {
    question: "Quelle est la caractéristique d'une peau sensible ?",
    options: [
      { text: "Brillance excessive", type: "grasse" },
      { text: "Réagit facilement aux produits et aux facteurs environnementaux", type: "seche" },
      { text: "Pores dilatés", type: "mixte" },
      { text: "Résistance élevée aux produits chimiques", type: "noire" }
    ]
  },
  {
    question: "Quel type de produit est le plus approprié pour un démaquillage en douceur de la peau sensible ?",
    options: [
      { text: "Eau micellaire", type: "seche" },
      { text: "Gommage exfoliant", type: "grasse" },
      { text: "Crème anti-âge", type: "noire" },
      { text: "Masque à l'argile", type: "mixte" }
    ]
  }
  // Ajoute les autres questions ici...
];


const products = {
  grasse: "Gel Purifiant Peau Grasse",
  seche: "Crème Hydratante Peau Sèche",
  mixte: "Lotion Équilibrante Peau Mixte",
  noire: "Sérum Éclaircissant Peau Noire"
};

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ grasse: 0, seche: 0, mixte: 0, noire: 0 });
  const [showProduct, setShowProduct] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // État pour l'élément sélectionné dans l'historique
  const [history, setHistory] = useState([]);
  const [clientName, setClientName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  // Charger l'historique des questionnaires
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('quizHistory');
      if (storedHistory !== null) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique', error);
    }
  };

  const saveResult = async (score) => {
    const result = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      clientName: clientName,
      answers: questions.map((q, index) => ({
        question: q.question,
        answer: Object.keys(scores).find(key => scores[key] === Math.max(...Object.values(scores)))
      })),
      recommendedProduct: getRecommendedProduct(),
    };

    try {
      const updatedHistory = [...history, result];
      setHistory(updatedHistory);
      await AsyncStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du résultat', error);
    }
  };

  const deleteHistoryItem = async (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    await AsyncStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
  };

  const handleStartQuiz = () => {
    setClientName('');
    setScores({ grasse: 0, seche: 0, mixte: 0, noire: 0 });
    setCurrentQuestionIndex(0);
    setShowNameInput(true);
    setShowProduct(false);
    setShowHome(false);
    setShowHistory(false);
  };

  const handleNameSubmit = () => {
    if (clientName.trim() === '') {
      alert('Veuillez entrer votre prénom et nom pour continuer.');
      return;
    }
    setShowNameInput(false);
  };

  const handleAnswerPress = (type) => {
    setScores((prevScores) => ({
      ...prevScores,
      [type]: prevScores[type] + 1
    }));

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowProduct(true);
      saveResult(scores);
    }
  };

  const getRecommendedProduct = () => {
    const highestScore = Math.max(...Object.values(scores));
    const productType = Object.keys(scores).find(key => scores[key] === highestScore);
    return products[productType];
  };

  // Fonction pour afficher les détails d'un questionnaire
  const showDetailsForItem = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
    setShowHistory(false);
  };

  // Obtenir la largeur de l'écran
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {showHome ? (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>Bienvenue sur le Quiz Yves Rocher</Text>
          <Button title="Commencer le questionnaire" onPress={handleStartQuiz} />
          <Button title="Voir les anciens questionnaires" onPress={() => {
            setShowHistory(true);
            setShowHome(false);
            setShowProduct(false);
          }} />
        </View>
      ) : showNameInput ? (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Entrez votre prénom et nom :</Text>
          <TextInput
            style={styles.input}
            placeholder="Prénom Nom"
            value={clientName}
            onChangeText={setClientName}
          />
          <Button title="Soumettre" onPress={handleNameSubmit} />
          <Button title="Revenir à l'accueil" onPress={() => setShowHome(true)} />
        </View>
      ) : showHistory ? (
        <View style={styles.historyContainer}>
          <Text style={styles.title}>Historique des questionnaires</Text>
          {history.length === 0 ? (
            <Text style={styles.noHistoryText}>Aucun questionnaire enregistré.</Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.historyItemContainer, { width: screenWidth - 32 }]}>
                  <TouchableOpacity onPress={() => showDetailsForItem(item)} style={styles.historyItem}>
                    <Text style={styles.historyClientName}>{item.clientName}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHistoryItem(item.id)}>
                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <Button title="Revenir à l'accueil" onPress={() => setShowHome(true)} />
        </View>
      ) : showDetails && selectedItem ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Détails du questionnaire</Text>
            <View style={styles.detailsCard}>
              <Text style={styles.detailsText}><Text style={styles.detailsLabel}>Client :</Text> {selectedItem.clientName}</Text>
              <Text style={styles.detailsText}><Text style={styles.detailsLabel}>Produit recommandé :</Text> {selectedItem.recommendedProduct}</Text>
              <Text style={styles.detailsSubtitle}>Réponses :</Text>
              {selectedItem.answers.map((answer, index) => (
                <View key={index} style={styles.answerContainer}>
                  <Text style={styles.questionText}>{answer.question}</Text>
                  <Text style={styles.answerText}>Réponse : {answer.answer}</Text>
                </View>
              ))}
            </View>
            <Button title="Retour à l'historique" onPress={() => {
              setShowDetails(false);
              setShowHistory(true);
            }} />
          </View>
        </ScrollView>
      ) : showProduct ? (
        <View style={styles.resultContainer}>
          <Text style={styles.productText}>
            Nous vous recommandons : {getRecommendedProduct()}
          </Text>
          <Button title="Revenir à l'accueil" onPress={() => setShowHome(true)} />
        </View>
      ) : (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex].question}
          </Text>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <Button
              key={index}
              title={option.text}
              onPress={() => handleAnswerPress(option.type)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  homeContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  questionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
  },
  productText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  historyContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  noHistoryText: {
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
  historyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  historyItem: {
    flex: 1,
  },
  historyClientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsLabel: {
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailsSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerContainer: {
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: '#555',
  },
  scrollView: {
    width: '100%',
  },
});