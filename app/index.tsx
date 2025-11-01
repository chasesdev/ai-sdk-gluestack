import { View, Text, Pressable, ScrollView } from "react-native";
import { Box, Button, ButtonText, Heading, VStack, HStack } from "@gluestack-ui/themed";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming
} from "react-native-reanimated";

export default function Index() {
  // Reanimated v4 test
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(scale.value === 1 ? 1.2 : 1);
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), 1, false);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6 gap-6">
        {/* NativeWind + Tailwind Test */}
        <View className="bg-card rounded-lg p-6 shadow-lg border border-border w-full max-w-md">
          <Text className="text-2xl font-bold text-foreground mb-2">
            Expo 54 + Gluestack v3
          </Text>
          <Text className="text-muted-foreground mb-4">
            With NativeWind v4 & Reanimated v3
          </Text>

          {/* Gluestack UI Components Test */}
          <VStack space="md">
            <Button onPress={handlePress} size="lg">
              <ButtonText>Tap to Animate</ButtonText>
            </Button>

            {/* Reanimated Test */}
            <Animated.View style={animatedStyle}>
              <Box
                bg="$primary500"
                p="$6"
                borderRadius="$lg"
                alignItems="center"
              >
                <Heading color="$white" size="md">
                  Reanimated Working!
                </Heading>
              </Box>
            </Animated.View>

            {/* Mixed NativeWind + Gluestack */}
            <HStack space="sm" className="mt-4">
              <Box className="flex-1 bg-secondary p-4 rounded-md">
                <Text className="text-secondary-foreground font-medium">
                  NativeWind
                </Text>
              </Box>
              <Box bg="$primary500" flex={1} p="$4" borderRadius="$md">
                <Text color="$white" fontWeight="$medium">
                  Gluestack
                </Text>
              </Box>
            </HStack>
          </VStack>
        </View>

        {/* Feature List */}
        <View className="w-full max-w-md gap-3">
          <FeatureCard
            title="Expo 54"
            description="Latest Expo SDK with new architecture"
          />
          <FeatureCard
            title="Gluestack UI v3"
            description="Beautiful, accessible UI components"
          />
          <FeatureCard
            title="NativeWind v4"
            description="Tailwind CSS for React Native"
          />
          <FeatureCard
            title="Reanimated v3"
            description="Smooth 60fps animations"
          />
        </View>
      </View>
    </ScrollView>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Pressable className="bg-card border border-border rounded-lg p-4 active:opacity-80">
      <Text className="text-lg font-semibold text-foreground mb-1">{title}</Text>
      <Text className="text-sm text-muted-foreground">{description}</Text>
    </Pressable>
  );
}
