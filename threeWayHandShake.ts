import { OdnTweetData, OdnTweets } from "../../../odnTweets"
import { OdnPlugins, OdnPluginResultData } from "../../../odnPlugins";
import { Log } from "../../../odnUtils";

export class ThreeWayHandShake {
  constructor(private tweetData: OdnTweetData, private fullName: string) {}

  /**
   * プラグインのメイン処理を実行
   *
   * @param {(isProcessed?: boolean) => void} finish
   */
  run(finish: (isProcessed?: boolean) => void) {
    const tweets = new OdnTweets(this.tweetData.accountData);
    tweets.text = "@" + this.tweetData.user.screenName + " ";
    if (ThreeWayHandShake.isValidSynCommand(this.tweetData)) {
      tweets.text += "SYN/ACK";
    }
    if (ThreeWayHandShake.isValidSynAckCommand(this.tweetData)) {
      tweets.text += "ACK";
    }
    tweets.targetTweetId = this.tweetData.idStr;

    // ツイートを投稿
    tweets.postTweet((isSuccess) => {
      tweets.likeTweet();
      finish();
    });
  }

  /**
   * プラグインを実行するかどうか判定
   *
   * @param {OdnTweetData} tweetData
   * @returns {boolean}
   */
  static isValid(tweetData: OdnTweetData): boolean {
    return ThreeWayHandShake.isValidSynCommand(tweetData) || ThreeWayHandShake.isValidSynAckCommand(tweetData) ? true : false;
  }

  /**
   * Synコマンドか
   *
   * @param {OdnTweetData} tweetData
   * @returns {boolean}
   */
  static isValidSynCommand(tweetData: OdnTweetData): boolean {
    return tweetData.isReplyToMe() && tweetData.command.match(/^(syn)$/gi) ? true : false;
  }

  /**
   * SynAckコマンドか
   *
   * @param {OdnTweetData} tweetData
   * @returns {boolean}
   */
  static isValidSynAckCommand(tweetData: OdnTweetData): boolean {
    return tweetData.isReplyToMe() && tweetData.text.match(/syn.?ack$/gi) ? true : false;
  }
}
