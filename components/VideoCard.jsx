import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { updateVideo } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({ videoItem, isBookmarksPage, refetchAllPosts }) => {
  const { user } = useGlobalContext();
  const {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    likedBy,
  } = videoItem;
  const [play, setPlay] = useState(false);

  const saveVideo = async () => {
    await updateVideo(
      { likedBy: likedBy.includes(user.$id) ? likedBy.filter((itm) => itm !== user.$id) : [...likedBy, user.$id] },
      videoItem.$id
    );
    await refetchAllPosts();
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode="cover" />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white  font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>
        {!isBookmarksPage && (
          <TouchableOpacity className="pt-2" onPress={saveVideo}>
            <Image
              source={likedBy.includes(user.$id) ? icons.bookmarkRed : icons.bookmark}
              className={`w-5 h-5`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl mt-3" resizeMode="cover" />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
