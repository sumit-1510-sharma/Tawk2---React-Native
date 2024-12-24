import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import QuesCard from "../components/QuesCard";
import * as SQLite from "expo-sqlite";

export default function History() {
  const [activeCategory, setActiveCategory] = useState("Deep Dark Secrets");
  const [historyQuestions, setHistoryQuestions] = useState([]);

  const categories = [
    "Deep Dark Secrets",
    "Drama Club",
    "Forbidden Confessions",
    "Mystery Moments",
    "The Unfiltered Truth",
    "Fantasies & Desires",
    "The Love Files",
    "Forever Questions",
    "Through Thick and Thin",
    "Untold Memories",
    "The Meaning of Life",
    "Future Fantasies",
    "Courage & Fears",
    "The Bucket List",
    "If You Knew Me…",
  ];

  const fetchHistoryQuestions = async (category) => {
    try {
      console.log(
        "Fetching previously generated questions for category:",
        category
      );
      const db = await SQLite.openDatabaseAsync("ProductionDatabase");
      const rows = await db.getAllAsync(
        `SELECT * FROM questionsTable WHERE category = ? AND type = ?`,
        [category, "history"]
      );
      const extractedQuestions = rows.map((item) => item.question);
      setHistoryQuestions(extractedQuestions);
    } catch (e) {
      console.error("Error fetching previously generated questions:", e);
    }
  };

  useEffect(() => {
    fetchHistoryQuestions(activeCategory);
  }, [activeCategory]);

  return (
    <ScreenWrapper bg="#121212">
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <Text style={styles.placeholder}></Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.outerTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tabButton,
                activeCategory === category && styles.activeTab,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === category && styles.activeTabText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cards Section */}
      <View style={styles.outerCardsContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {historyQuestions.map((card, index) => (
            <QuesCard key={index} text={card} categoryTab={activeCategory} />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  backButton: {
    color: "white",
    fontSize: 24,
  },
  title: {
    color: "white",
    fontSize: 20,
  },
  placeholder: {},
  outerTabsContainer: {
    marginHorizontal: 16,
  },
  tabsContainer: {
    paddingVertical: 20,
    gap: 18,
  },
  tabButton: {
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "white",
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    color: "white",
  },
  activeTabText: {
    color: "black",
  },
  scrollContent: {
    gap: 20,
  },
  outerCardsContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 16,
  },
});
