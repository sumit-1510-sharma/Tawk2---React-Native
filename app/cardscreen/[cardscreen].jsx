import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Card from "../../components/Card";
import { categories } from "../../assets/categories"; // Import the categories data
import * as SQLite from "expo-sqlite";
import { OPEN_AI_API_KEY } from "@env";

export default function CardScreen() {
  const { cardscreen } = useLocalSearchParams(); // Get the dynamic category from URL
  const [entries, setEntries] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryPrompt, setCategoryPrompt] = useState("");
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index
  const flatListRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false); // To manage loading state
  const [currentQuestions, setCurrentQuestions] = useState([]);

  useEffect(() => {
    // Call the categoryTitleFunction to update the state
    categoryTitleFunction(cardscreen);
  }, [cardscreen]); // Trigger when the `cardscreen` prop changes

  useEffect(() => {
    // Fetch questions once the categoryTitle state is updated
    if (categoryTitle) {
      fetchCurrentQuestions(categoryTitle);
    }
  }, [categoryTitle]);

  const categoryTitleFunction = (cardscreen) => {
    let title = "";
    let prompt = "";
    switch (cardscreen) {
      case "deep_dark_secrets":
        title = "Deep Dark Secrets";
        prompt =
          "Generate 30 questions for the 'Deep Dark Secrets' pack. 50% of the questions (15) should be NSFW, and the rest should remain playful, daring, or revealing. The questions should be mixed together so the NSFW content is integrated within the overall set. Keep the tone mischievous and fun, with each question no more than 7-8 words. Ensure the NSFW content is playful, respectful, and encouraging open, honest conversation.";
        break;
      case "drama_club":
        title = "Drama Club";
        prompt =
          "Generate 30 couple questions 'For all those juicy stories you just can’t resist sharing—expect drama, suspense, and laughter' pack. 50% of the questions (15) should be NSFW, with the rest focusing on juicy, dramatic, and laughter-filled stories. The questions should be mixed together so the NSFW content fits naturally. Keep them playful, exciting, and engaging, with each question no more than 7-8 words. Ensure the NSFW content is playful, respectful, and encouraging open, honest conversation.";
        break;
      case "forbidden_confessions":
        title = "Forbidden Confessions";
        prompt =
          "Generate 30 questions for the 'Forbidden Confessions' pack. 50% of the questions (15) should be NSFW, with the rest being slightly risqué, secretive, or taboo. The questions should be mixed together, with NSFW content flowing naturally within the pack. Keep them playful, teasing, and concise (7-8 words), encouraging open sharing. Ensure the NSFW content is playful, respectful, and encouraging open, honest conversation.";
        break;
      case "mystery_moments":
        title = "Mystery Moments";
        prompt =
          "Generate 30 questions for the 'Mystery Moments' pack. These should explore mysterious, untold stories or “what really happened” moments. Keep the tone fun, engaging, and lighthearted. All questions should be concise (7-8 words).";
        break;
      case "the_unfiltered_truth":
        title = "The Unfiltered Truth";
        prompt =
          "Generate 30 questions for the 'Unfiltered Truth' pack. These should be bold, honest, and raw—things people wouldn’t usually admit. Keep the tone conversational and all questions concise (7-8 words).";
        break;
      case "fantasies_and_desires":
        title = "Fantasies & Desires";
        prompt =
          "Generate 30 questions for the 'Fantasies & Desires' pack. 50% of the questions (15) should be NSFW, exploring fantasies and intimate desires, while the rest should be playful and intimate. The NSFW questions should be mixed naturally with the non-NSFW ones. Keep the tone fun, slightly daring, and concise (7-8 words). Ensure the NSFW content is playful, respectful, and encouraging open, honest conversation.";
        break;
      case "the_love_files":
        title = "The Love Files";
        prompt =
          "Generate 30 questions for 'The Love Files' pack. These should bring out heartfelt, romantic thoughts and memories. Keep the tone warm and endearing. All questions should be concise (7-8 words).";
        break;
      case "forever_questions":
        title = "Forever Questions";
        prompt =
          "Generate 30 questions for the 'Forever Questions' pack. These should focus on deep, soulmate-level questions about long-term connection and love. Keep the tone warm, introspective, and concise (7-8 words).";
        break;
      case "through_thick_and_thin":
        title = "Through Thick and Thin";
        prompt =
          "Generate 30 questions for the 'Through Thick and Thin' pack. These should explore commitment, challenges, and growth in the relationship. Keep the tone supportive and conversational. All questions should be concise (7-8 words).";
        break;
      case "untold_memories":
        title = "Untold Memories";
        prompt =
          "Generate 30 questions for the 'Untold Memories' pack. These should encourage sharing never-revealed personal stories and experiences. Keep the tone curious and warm. All questions should be concise (7-8 words).";
        break;
      case "the_meaning_of_life":
        title = "The Meaning of Life";
        prompt =
          "Generate 30 questions for 'The Meaning of Life' pack. These should challenge beliefs and spark deep, philosophical discussions. Keep the tone reflective and curious. All questions should be concise (7-8 words).";
        break;
      case "future_fantasies":
        title = "Future Fantasies";
        prompt =
          "Generate 30 questions for the 'Future Fantasies' pack. These should inspire discussions about future goals, dreams, and possibilities. Keep the tone imaginative and hopeful. All questions should be concise (7-8 words).";
        break;
      case "courage_and_fears":
        title = "Courage & Fears";
        prompt =
          "Generate 30 questions for the 'Courage & Fears' pack. These should explore personal fears and acts of bravery. Keep the tone empathetic and engaging. All questions should be concise (7-8 words).";
        break;
      case "the_bucket_list":
        title = "The Bucket List";
        prompt =
          "Generate 30 questions for 'The Bucket List' pack. These should uncover life goals, travel dreams, and ultimate aspirations. Keep the tone fun and optimistic. All questions should be concise (7-8 words).";
        break;
      case "if_you_knew_me":
        title = "If You Knew Me…";
        prompt =
          "Generate 30 questions for the 'If You Knew Me' pack. 50% of the questions (15) should be NSFW, mixed with the rest being revealing, lighthearted, and daring. The questions should be designed to spark deep revelations while encouraging a sense of curiosity and fun. Keep them concise (7-8 words) and open for honest, often playful sharing. Ensure the NSFW content is playful, respectful, and encouraging open, honest conversation.";
        break;
      default:
        title = "Unknown Category"; // Default case
        prompt = "Unknown Category"; // Default case
    }
    setCategoryTitle(title); // Update the state with the title
    setCategoryPrompt(prompt);
  };

  const fetchCurrentQuestions = async (category) => {
    try {
      console.log("Fetching questions for category:", category);

      // Simulating a database fetch
      const db = await SQLite.openDatabaseAsync("ProductionDatabase");

      const rows = await db.getAllAsync(
        `SELECT * FROM questionsTable WHERE category = ? AND type = ?`,
        [category, "current"]
      );

      const extractedQuestions = rows.map((item) => item.question);

      // Append "Loading more questions..." to the list
      const questionsWithLoading = [
        ...extractedQuestions,
        "Loading more questions...", // Add the extra item
      ];

      setCurrentQuestions(questionsWithLoading);
    } catch (e) {
      console.error("Error fetching current questions:", e);
    }
  };

  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex });
    }
  };

  const moveToHistory = async (category) => {
    console.log(`Moving questions of category "${category}" to history`);
    try {
      const db = await SQLite.openDatabaseAsync("ProductionDatabase");
      await db.runAsync(
        `UPDATE questionsTable SET type = ? WHERE category = ? AND type = ?`,
        ["history", category, "current"]
      );
      console.log("Moved current questions to history");
    } catch (error) {
      console.error("Error moving questions to history:", error);
      throw error; // Rethrow to ensure the error is caught in the calling function
    }
  };

  const addNewQuestions = async (category, questions) => {
    console.log(`Adding new questions to category: "${category}"`);
    try {
      const db = await SQLite.openDatabaseAsync("ProductionDatabase");
      const insertPromises = questions.map((question) =>
        db.runAsync(
          `INSERT INTO questionsTable (category, question, type, created_at) VALUES (?, ?, ?, ?)`,
          [category, question, "current", new Date().toISOString()]
        )
      );
      await Promise.all(insertPromises); // Run all inserts concurrently
      console.log("New questions added successfully!");
    } catch (error) {
      console.error("Error adding new questions:", error);
      throw error; // Rethrow to ensure the error is caught in the calling function
    }
  };

  const handleGenerateQuestions = async (category, newQuestions) => {
    try {
      // Step 1: Move current questions to history
      await moveToHistory(category);

      // Step 2: Add new questions as current
      await addNewQuestions(category, newQuestions);

      console.log("Questions updated successfully!");
    } catch (error) {
      console.error("Error in handleGenerateQuestions:", error);
      throw error; // Ensure the caller knows if this fails
    }
  };

  const fetchMoreCards = async () => {
    // setLoadingMore(true); // Show the loader
    try {
      console.log("Fetching more cards...");
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPEN_AI_API_KEY}`, // Replace with your actual API key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a conversation assistant designed to create engaging, fun, and meaningful questions for various categories of conversation packs for couples. Each pack has a unique theme, tone, and purpose. All questions should be concise (7-8 words), readable at an 8th-grade level, and encourage open, honest, and sometimes daring conversation. Maintain the tone that fits the pack’s theme—whether mischievous, fun, romantic, or introspective—while ensuring the content flows naturally.",
              },
              {
                role: "user",
                content: `${categoryPrompt}`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "question_response",
                schema: {
                  type: "object",
                  properties: {
                    questions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                  required: ["questions"],
                  additionalProperties: false,
                },
                strict: true,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedContent = JSON.parse(data.choices[0].message.content);
      // console.log(parsedContent.questions);

      // Step 3: Process the generated questions
      await handleGenerateQuestions(categoryTitle, parsedContent.questions);

      // Step 4: Redirect the user back
      router.back();
    } catch (error) {
      console.error("Error fetching more cards:", error);
    } finally {
      setLoadingMore(false); // Hide the loader
    }
  };

  return (
    <ScreenWrapper bg="#121212">
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
        </View>
        <FlatList
          ref={flatListRef} // Attach ref to FlatList
          data={currentQuestions}
          renderItem={({ item, index }) => (
            <Card item={item} category={categoryTitle} index={index} />
          )}
          keyExtractor={(index) => index}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToAlignment="center"
          onEndReached={fetchMoreCards} // Trigger API call when reaching the end
          onEndReachedThreshold={0.5} // Fetch more when halfway through the last card
          // ListFooterComponent={
          //   loadingMore ? (
          //     <ActivityIndicator
          //       size="large"
          //       color="#fff"
          //       style={styles.loader}
          //     />
          //   ) : null
          // }
        />

        {/* Previous and Next Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePrevious}
            style={styles.button}
            disabled={currentIndex === 0} // Disable if at the first card
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={handleNext}
            style={styles.button}
            disabled={currentIndex === entries.length - 1} // Disable if at the last card
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={fetchMoreCards} style={styles.button}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    position: "relative",
    flexDirection: "row",
    backgroundColor: "#121212",
    padding: 15,
  },
  backButton: {
    position: "absolute",
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    width: "80%",
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
});
